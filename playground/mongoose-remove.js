const {ObjectID} = require('mongodb');

const {mognoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findOneAndRemove({_id: '5b0e663fe2ad1c8d35c4b153'}).then((todo) => {

});

Todo.findByIdAndRemove('5b0e663fe2ad1c8d35c4b153').then((todo) => {
    console.log(`Removed todo: '${todo.text}'`);
});