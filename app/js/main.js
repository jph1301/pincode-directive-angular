
'use strict';

require.config({
    baseUrl:'js',
    paths:{
        jquery: '../lib/jquery/jquery-1.8.2.min',
        angular: '../lib/angular/angular.min',
        toastr: '../lib/toastr.min',
        logger: 'components/logger',
        loginctrl: 'controllers/login',
        securectrl: 'controllers/secure',
        messagesService: 'services/messagesService'
    },
    shim:{
        'angular':{
            exports:'angular'
        },
        'jquery': {
            exports: '$'
        },
        'toastr': {
            deps:['jquery'],
            exports: "toastr"
        },
        'routes': {
            deps:['loginctrl','securectrl']
        },
        'logger': {
            deps:['jquery','angular','toastr']
        }
    },
    priority:[
        'angular'
    ]
});

require([
    'angular',
    'jquery',
    'loginctrl',
    'securectrl',    
    'app',
    'toastr',
    'logger',
    'routes',
    'messagesService'
], function (angular) {
    //After all dependencies are loaded, bootstrap application
    $(document).ready(function () {
        angular.bootstrap(document, ['pincode']);
    });
});