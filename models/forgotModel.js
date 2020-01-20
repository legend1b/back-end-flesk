//Import express web framework for node.js
const mongoose = require('mongoose')

//Declare the mongoose Schema
const Schema = mongoose.Schema

//Get the date and time here
const today = new Date;
const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

// Construct the userSchema for how each document will look like in the database "Users" collection
const forgotSchema = new Schema(
    {
        email:{type: String, require: true},
        resetPasswordToken:{type: String, require: true},
        resetPasswordExpires:{type: String, default:date},
    },
    { timestamps: true },
)

//Export the module for use in other modules
module.exports = mongoose.model('forgot', forgotSchema)