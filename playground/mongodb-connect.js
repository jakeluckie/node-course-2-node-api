const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp', (err, db) => {
    if (err) {
        console.log(err);
        return console.log('Unable to connect to the database server (MongoDB)');
    };

    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Hang me undies',
    //     completed: false
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert Todo', err);
    //     };

    //     console.log(JSON.stringify(res.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
        name: 'Zuk',
        age: 40,
        location: 'Wakanda'
    }, (err, res) => {
        if (err) {
            return console.log('Unable to insert Todo', err);
        };

        console.log(JSON.stringify(res.ops, undefined, 2));
    });

    db.close();
});