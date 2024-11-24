const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://callielamb:cs260@cs260.f3gbs.mongodb.net/?retryWrites=true&w=majority&appName=CS260";

const client = new MongoClient(url, { tls: true, serverSelectionTimeoutMS: 3000, autoSelectFamily: false, });

const config = require('./dbConfig.json');
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const config = require('./dbConfig.json');