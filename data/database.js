const mongodb = require('mongodb');
//const { connect } = require('../routes/auth.routes');

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017'); //connect to db server
    database = client.db('online-shop');
}

function getDb() { //connect to specific db
    if (!database) {
        throw new Error("No database connection found.");
    }

    return database;
}

module.exports = {
    connectToDatabase: connectToDatabase,
    getDb: getDb
}
