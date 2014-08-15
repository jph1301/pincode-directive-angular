
var app = require('../app'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User');

module.exports = function () {
    // serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    })

    passport.deserializeUser(function(id, done) {
        User.findOne({ _id: id }, function (err, user) {
            done(err, user);
        })
    })

    // Use Local Strategy
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function(email, password, done) {
            User.findOne({ email: email }, function (err, user) {
                if (err) { 
                    return done(err);
                }
                if (!user) {
                    return done(null, false, { message: 'Unknown user' });
                }
                if (!user.authenticate(password)) {
                    console.log(user.email + " failed to log in (invalid password)"); 
                    return done(null, false, { message: 'Invalid password' });
                }
                console.log(user.email + " logged in OK");
                return done(null, user);
            })
        }
    ))
};