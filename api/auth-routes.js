//Import express web framework for node.js
const express = require('express');

//Initialize the router
const router = express.Router();

//Import auth controller
const AuthController = require('../controllers/authCtrl')

//Import check-auth middleware
const checkAuth = require('../middleware/check-auth')

//This root route handle the submision of forgot password data to the database
router.post('/forgotpassword', AuthController.forgot);

//This root route handle the submision of incoming registration data to the database
router.post('/signup', AuthController.signup);

//Handle login route
router.post('/login',AuthController.login);

//Handle get request for a single user based on their specific ID (PROTECTED)
router.get('/me/:userId', checkAuth, AuthController.me);


//Export the module for use in other modules
module.exports = router