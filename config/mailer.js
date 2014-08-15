function mailer (app) {

    var nodemailer = require('nodemailer'),
        util = require('util'),
        crypto = require('crypto'),
        mailerStrings = require('./application-strings'),
        os = require('os'),
        api = {};

    // Configure Email
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "you@gmail.com",
            pass: "your_password_here"
        }
    });

    // Send confirmation email to user
    api.sendRegistrationEmail = function(destinationMail, confirmationString) {

        try {
            smtpTransport.sendMail({
            from: mailerStrings.email.registrationSubject,
            to: destinationMail,
            subject: mailerStrings.email.registrationSubject,
            text: mailerStrings.email.registrationBody + 
                util.format("http://%s:%d/#confirm/%s", os.hostname(), app.settings.port, confirmationString)
            },
            function(error, response){
                if(error){
                    console.log(error);
                }
                else {
                    console.log("Message sent: " + response.message);
                }
            });
        }
        catch(e) {
            console.log(e);
        }
    };

    return api;
}

module.exports = mailer;