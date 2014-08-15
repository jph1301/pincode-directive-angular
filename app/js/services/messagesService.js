define(['app'], function (app) {
	app.factory('messagesService', function() {
		return {
			messages: {
		        "Bad Password" : "Login Failed. Incorrect user or password. Please try again.",
		        "login": "I want to login instead",
		        "register": "I'm not registered!",
		        "registerSuccess": " was created successfully",
		        "alreadyRegistered": " is already registered!"			
			}
		}
	});
});