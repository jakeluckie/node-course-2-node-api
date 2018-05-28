const {ObjectID} = require('mongodb');
const {mognoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var userId = '5b0678cd49141e86147a138411';

// var id = '5b0bb34d559d905620f429c811';

// if (!ObjectID.isValid(id)) {
//     console.log('Id not valid');
// };
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos)
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo)
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     };
//     console.log('Todo by id', todo)
// }).catch((e) => console.log(e));

if (!ObjectID.isValid(userId)) {
    console.log('Invalid user ID');
} else {
    User.findById(userId).then((user) => {
        if (!user) {
            return console.log('User ID not found');
        };
        console.log(`Fetch user email by ID: ${user.email}`);
    }).catch((e) => console.log(e));
};