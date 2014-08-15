
var app = require('../../app.js'),
    mongoose = require('mongoose'),
    User = require('../models/user'),
    crypto = require('crypto'),
    os = require('os'),
    nodemailer = require('nodemailer'),
    util = require('util'),
    encryptionHelper = require('../helpers/encryption-helper');

// signup
exports.create = function (req, res) {
    
    var checkExistingUser = User.findOne({ 'email': req.body.email });

    //First, check if the user already exists in our DB
    checkExistingUser.exec(function (err, user) {
        if(user === null) {

            // assign user sent in the registration to the user schema in mongo
            var newUser = new User(req.body);

            // user will need to confirm registration
            newUser.confirmed = false;

            /* Create a unique string which will be for the user 
            to confirm the email used in the registration*/
            var buf = crypto.randomBytes(4);
            newUser.confirmationstring = buf.toString('hex');
            
            // Try to save it on our DB
            newUser.save(function (err, user) {
                if (err) {
                    res.send({ error: 1 }, 200);
                }
                else {
                    console.log("Registered successfully");

                    /*Now that the user was registered in our DB,
                    let's send the confirmation email*/
                    var mailer = require('../../config/mailer.js')(app),
                    hashedConfirmation = encryptionHelper.encrypt(user.confirmationstring + ";" + buf.toString('hex'));

                    //send Email
                    mailer.sendRegistrationEmail(user.email, hashedConfirmation);
                    res.send({ error: 0, user: user.email }, 201);
                }
            });
        }
        //User is already registered
        else {
            res.send({error: 1, user: user.email}, 200);
        }

    });
};

// logout
exports.logout = function (req, res) {
    req.logout();
    res.send(200);
};

exports.getUserDetails = function (req, res) {
    if(!req.user) {
        res.send({ loggedIn: 0 }, 200);
    }
    else {
        var getUser = User.findOne({ 'email': req.user.email }),
        returnedUser = {};

        getUser.exec(function (err, user) {
            if (err) {
                res.send("Could not retrieve user's details", 400);
            }

            returnedUser.email = user.email;
            res.send({ loggedIn: 1, user: returnedUser }, 201);
        });
    }   
};