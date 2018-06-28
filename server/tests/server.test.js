const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not create todo with invalid body data', (done) => {

        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
             .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toBe(undefined);
            })
            .end(done);
    });

    it('should return 404 for non-object IDs', (done) => {
        request(app)
            .get('/todos/2134f')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toBe(undefined);
            })
            .end(done);
    });

    it('should not return a todo doc created by another user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete todo doc', (done) => {
        var hexId = todos[1]._id.toHexString();
        // var hexId2 = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));

            });
    });

    it('should return 404 if user 1 tries to delete the second todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        // var hexId2 = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toExist();
                    done();
                }).catch((e) => done(e));

            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toBe(undefined);
            })
            .end(done);
    });

    it('should retun 404 if ObjectID is invalid', (done) => {
        request(app)
        .get('/todos/2134f')
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .expect((res) => {
            expect(res.body.todo).toBe(undefined);
        })
        .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var update = {
            "text": "updated text yehoo",
            "completed": true
        };

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .send(update)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(update.text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });

    it('should get 404 trying to update a todo which does not belong to user', (done) => {
        var hexId = todos[0]._id.toHexString();
        var update = {
            "text": "updated text yehoo",
            "completed": true
        };

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send(update)
        .expect(404)
        .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var update = {
            "text": "shingly ding dang",
            "completed": false
        };

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send(update)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(update.text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
    });

    describe('Get /users/me', () => {
        it('should return user if authenticated', (done) => {
            request(app)
                .get('/users/me')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                    expect(res.body.email).toBe(users[0].email);
                })
                .end(done);
                
        });

        it('should return a 401 if not authenticated', (done) => {
            request(app)
                .get('/users/me')
                .set('x-auth', '')
                .expect(401)
                .expect((res) => {
                    expect(res.body).toEqual({});
                })
                .end(done);
        });
    });

    describe('POST /users', () => {
        it('should create a user', (done) => {
            var email = 'example@example.com';
            var password = '123nmb!';

            request(app)
                .post('/users')
                .send({email, password})
                .expect(200)
                .expect((res) => {
                    expect(res.headers['x-auth']).toExist();
                    expect(res.body._id).toExist();
                    expect(res.body.email).toBe(email);
                })
                .end((err) => {
                    if(err){
                        return done(err);
                    }

                    User.findOne({email}).then((user) => {
                        expect(user).toExist();
                        expect(user.password).toNotBe(password);
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should return validation errors if request invalid', (done) => {
            var email = 'bleep';
            var password = '333';
            request(app)
                .post('/users')
                .send({email, password})
                .expect(400)
                .end(done);
        });

        it('should not create user if email in use', (done) => {
            var email = 'jakeluckie@gmail.com';
            var password = 'niggerfuck';

            request(app)
                .post('/users')
                .send({email, password})
                .expect(400)
                .end(done);

        });
    });

    describe('POST /users/login', () => {
        it('should login user and return auth token', (done) => {
            request(app)
                .post('/users/login')
                .send({
                    email: users[1].email,
                    password: users[1].password
                })
                .expect(200)
                .expect((res) => {
                    expect(res.headers['x-auth']).toExist();
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    User.findById(users[1]._id).then((user) => {
                        expect(user.tokens[1]).toInclude({
                            access: 'auth',
                            token: res.headers['x-auth']
                        });
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should reject invalid body', (done) => {
            request(app)
                .post('/users/login')
                .send({
                    email: users[1].email,
                    password: 'badpassword'
                })
                .expect(400)
                .expect((res) => {
                    expect(res.headers['x-auth']).toNotExist();
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    User.findById(users[1]._id).then((user) => {
                        expect(user.tokens.length).toBe(1);
                        done();
                    }).catch((e) => done(e));
                });
        });
    });

    describe('DELETE /users/me/token', () => {
        it('should remove auth token on logout', (done) => {
            request(app)
                .delete('/users/me/token')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    } 

                    User.findById(users[0]._id).then((user) => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    }).catch((e) => done(e));
                });
        });
    });
});