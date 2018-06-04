const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
}, {
    _id: new ObjectID(),    
    text: 'second test todo',
    completed: true,
    completedAt: 333
}];

// console.log('GETEM', todos[1]._id.);

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
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
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toBe(undefined);
            })
            .end(done);
    });

    it('should return 404 for non-object IDs', (done) => {
        request(app)
            .get('/todos/2134f')
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toBe(undefined);
            })
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete todo doc', (done) => {
        var hexId = todos[1]._id.toHexString();
        // var hexId2 = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
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

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toBe(undefined);
            })
            .end(done);
    });

    it('should retun 404 if ObjectID is invalid', (done) => {
        request(app)
        .get('/todos/2134f')
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
        .send(update)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(update.text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
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
        .send(update)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(update.text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
    });
});