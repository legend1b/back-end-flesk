require('dotenv').config()

//Import express web framework for node.js
const express = require('express')

//Import cors for cross origin access to the apis routes
const cors = require('cors')

//Import body-parser for parsing incoming request bodies in a middleware before your handlers
const bodyParser = require('body-parser')

//Import the databse connection module
const dbCon = require('./dbcon/dbcon')

//Import the routes module for Super Admin
const authRoutes = require('./api/auth-routes')

//Import the routes module for the learners
const learnerRoutes = require('./api/learners-routes')

//Import the routes module for Super Admin
const superAdminRoutes = require('./api/superAdmin-routes')

//Set PORT to be connected to if not available in the .env default one will be used
const apiPort = process.env.PORT || 4001	

//Declare express
const app = express()

//Use bodyparser to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}))

//Check the database connection
dbCon.once('open', () => console.log('MongoDB connection established!'))

//Use cors
app.use(cors())

//Use bodyparser to parse application/json
app.use(bodyParser.json())

//Set the routes for the auth
app.use('/auth', authRoutes)

//Set the routes for the learners according to their imported routes api
app.use('/users', learnerRoutes)

//Set the routes for the learners according to their imported routes api
app.use('/superadmin', superAdminRoutes)

//Start listening to the app port to handle request
app.listen(apiPort, () => {
    console.log(`Server running on port ${apiPort}`)
})