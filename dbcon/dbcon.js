//Import express web framework for node.js
const mongoose = require('mongoose')

//
require('dotenv').config()

//Declare promiseglobally to be used when connecting to the database
mongoose.Promise = global.Promise

//Here is the connection to the mongodb that's located locally
//const DBURL = process.env.MONGODB_URL;
const DBURL = "mongodb://127.0.0.1:27017/fleskAIDB"

//Remote mongodb connection "either of both can be use"

 //const DBURL = 'mongodb+srv://fleskaidbadmin:0iMqwb6p973aCAve@cluster0-oomfi.azure.mongodb.net/test?retryWrites=true&w=majority'

//Mongo connection code
mongoose.connect(DBURL, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true})
    .catch(err => {
        console.error('MongoDB connection error:', err.message)
    })

//Declare variable to be exported for other modules
const dbCon = mongoose.connection

module.exports = dbCon
