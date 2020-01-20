//Import express web framework for node.js
const express = require('express');

//Initialize the router
const router = express.Router();

//Import check-auth middleware
const checkAuth = require('../middleware/check-auth')

//Import suAdmin controller
const SuperAdminController = require('../controllers/superAdminCtrl')

//Let Super Admin get all users (PROTECTED)
router.get('/allusers', checkAuth, SuperAdminController.getAllUsers);

//Handling deleting of user (PROTECTED)
router.delete('/deleteuser/:userId', checkAuth, SuperAdminController.deleteOneUser);

//Export the module for use in other modules
module.exports = router