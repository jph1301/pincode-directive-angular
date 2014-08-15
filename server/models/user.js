// user schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    username: String,
    confirmed: Boolean, //registered users need to confirm registration
    confirmationstring: String, //guid for user to confirm registration
    hashed_password: String,
    salt: String,  
});

// virtual attributes
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password; });

// validations
var validatePresenceOf = function (value) {
    return value && value.length;
};


UserSchema.path('email').validate(function (email) {
    if(email !== undefined) {
        return email.length;
    }
    else return false;
}, 'Email cannot be blank');

UserSchema.path('hashed_password').validate(function (hashed_password) {
    return hashed_password.length;
}, 'Password cannot be blank');


// mongoose pre hook
UserSchema.pre('save', function(next) {
    if (!this.isNew) {
        return next();
    }
    if (!validatePresenceOf(this.password)) {
        next(new Error('Invalid password'));
    }        
    else next();
});

// methods
// "Adds an instance method to documents constructed from Models compiled from this schema", in mongoose docs
UserSchema.method('authenticate', function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
});

UserSchema.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
});

UserSchema.method('encryptPassword', function(password) {
    if (!password) {
        return '';
    }
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
});

module.exports = mongoose.model('User', UserSchema);
