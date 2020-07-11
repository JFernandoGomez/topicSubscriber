const MongoClient = require('mongodb').MongoClient;

const user = encodeURIComponent('dbUser');
const password = encodeURIComponent('TaU0tUuunP4DmCv5');

// Connection URL
const url = `mongodb+srv://${user}:${password}@cluster0-mjwq6.mongodb.net/test?retryWrites=true&w=majority`;

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true } );

module.exports = client;
