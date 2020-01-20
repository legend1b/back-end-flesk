//Import bcrypt to hash password
const bcrypt = require('bcryptjs');

//Import validator to valid incoming email address
const validator = require("email-validator");

//Import jsonwebtoken to generate token when user login for authentication
const jwt = require("jsonwebtoken");

//Import nodemailer to email user
const nodemailer =  require('nodemailer');

//Import users database schema
const User =  require('../models/userModel');

//Import users database schema
const Forgot =  require('../models/forgotModel');


//Handle signup without auth for all users
signup = (req, res) => {
    //If email already exist do not create account
    console.log(req.body.email);
    if (User.findOne({ email: req.body.email })) {
        res.status(400).json({
            message: 'Email already exist'
        })
    }

	var hash = bcrypt.hashSync(req.body.password, 10);
    const userData = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        age: req.body.age,
        email: req.body.email,
        password: hash,
    });

    if(validator.validate(req.body.email)){
        userData.save().then(
        saved => {
            console.log("Saved to database with a unique ID of: " + saved._id)
            res.status(200).json({
                success: true,
                id: saved._id,
                message: 'User created successfully!',
            })
        })
        .catch(error => {
            res.status(500).json({
                error,
            })
        })
    }else{
        res.status(400).json({
            message: 'Invalid email address',
        })
    }
};

//Handle login and and generate token to be stored to the client and send back for verification when requesting for a protected route api
login = (req, res) => {
	console.log(req.body)
	let email = req.body.email
    let pswd = req.body.password
    User.findOne({ email: email }).then( user => { 
        console.log(user._id) 

        if (user) {
            var compareHash = bcrypt.compareSync(pswd, user.password);
            if (compareHash) {
                const token = jwt.sign({
                    _id: user._id,
                    username: user.username,
                    regDate: user.regDate,
                    regTime: user.regTime,
                },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h"
                    })
                const { password, ...userWithoutPassword } = user.toObject()
                
                res.status(200).json({
                    message: 'Authentication successful',
                    user: userWithoutPassword,
                    token: token
                })
            }
        }
        
    }).catch( err => {
        res.status(500).json({
            message: 'An error occured'
        })
    })
    
}

//Handles forgot password and generate token to be stored to forgot password database
forgot = (req, res) => {
	//console.log(req.body)
    let email = req.body.email
    User.findOne({ email: email }).then(user => { 
        
        if (!user) {
            res.status(500).json({
                message: 'User not found'
            })
        }
        else{           
            const token = jwt.sign({
            _id: user._id,
        },
        process.env.JWT_SECRET,//
            {
                expiresIn: "1h"
            });

        const ResetData = new Forgot({
            email: email,
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 3600000, //1 hour
        });

        ResetData.save().then(
            saved => {
                //console.log(user.email);
                //console.log(token);
                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail', 
                    auth: {
                        //allow less secured app settings must be selected for this gmail account
                      user: 'flesktechnology@gmail.com',
                      pass: process.env.GMAILPW,
                    }
                  });
                  var mailOptions = {
                    to: user.email,
                    from: 'flesktechnology@gmail.com',
                    subject: 'Account Password Reset',
                    text: 'You are receiving this because there was a request to reset the password for your account.\n\n' +
                      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                      'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                      'If you did not make a password reset request, please ignore this email. Thanks.\n'
                  };
                  smtpTransport.sendMail(mailOptions, function(err) {
                    res.status(200).json({
                        message: 'Email sent',
                    })
                  });
                
    }).catch( err => {
        res.status(500).json({
            message: 'An error occured'
        })
    });
    }
})

}

//Handle displaying of data of a single user based on their id (PROTECTED)
me = (req, res) => {
    
    const uID = req.params.userId;
    console.log(uID);
    User.findById(uID).select('firstname lastname username email age regDate regTime isLearner  isInstructor _id').then(
        result => {
        res.status(200).json({
            result: result,
            request: {
                type: "GET",
                url: 'http://'+req.headers.host+'/users'
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(400).json({
            err,
        })
    })
}

module.exports = {
	signup,
	login,
    me,
    forgot,
}