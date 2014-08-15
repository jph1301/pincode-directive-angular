'use strict';

define(['app'], function (app) {

    return app.config(function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: '/partials/enter',
            controller: 'LoginCtrl'
        })
        .when('/unsecured', {
            templateUrl: '/partials/unsecure',
            controller: 'UnsecureCtrl'
        })
        .when('/secure', {
            templateUrl: '/partials/secure',
            controller: 'SecureCtrl'
        })
        .otherwise({
          redirectTo: '/login'
        }); 
    });
});