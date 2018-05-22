//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp', (err, db) => {
    if (err) {
        console.log(err);
        return console.log('Unable to connect to the database server (MongoDB)');
    };

    console.log('Connected to MongoDB server');

    // find a document with a specific object id

    // db.collection('Todos').find({
    //     _id: new ObjectID('5afe7191e9972003b2d514b8')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });


    // find documents with specific field valies, i.e, all documents with the completed field set as false

    // db.collection('Todos').find({completed:false}).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    //count how many documents in the Todos collection

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });


    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    // find document which has a field name with the value of 'Jake'

    // db.collection('Users').find({name:'Jake'}).toArray().then((docs) => {
    //     console.log(`Found user: ${docs[0].name}`);
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    // db.collection('Users').find({age:40}).limit(2).toArray().then((docs) => {
    //     console.log(`Found 2 users with the age: ${docs[0].age}`);
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    //find all documents with the field age:40, sort the results by the name field in ascending order

    db.collection('Users').find({age:40}).sort([['name', 1]]).toArray().then((docs) => {
        console.log(`Found 2 users with the age: ${docs[0].age}`);
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    //db.close();
});