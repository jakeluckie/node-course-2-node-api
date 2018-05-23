//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp', (err, db) => {
    if (err) {
        console.log(err);
        return console.log('Unable to connect to the database server (MongoDB)');
    };

    console.log('Connected to MongoDB server');

    // db.collection('Todos').deleteMany({text: 'Scratch Head'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').deleteOne({text:'Scratch Head'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').findOneAndDelete({completed: false}).then((res) => {
    //     console.log(res);
    // });

    
    // db.collection('Users').deleteMany({name:'Sheryl'}).then((result) => {
    //     console.log(`Deleted ${result.result.n} records.`);
    // });

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5b013d45031ac6095a9a7110')
    }).then((result) => {
        console.log(result);
    });

    //db.close();
});