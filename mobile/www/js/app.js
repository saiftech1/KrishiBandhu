// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
/// <reference path="typings/tsd.d.ts" />

var app = angular.module('krishiBandhu', ['ionic', 'LocalStorageModule', 'krishiBandhu.controllers', 'krishiBandhu.services']);

app.run(function($ionicPlatform, $ionicPopup) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                $ionicPopup.confirm({
                        title: 'No Internet Connection',
                        content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
                    })
                    .then(function(result) {
                        if (!result) {
                            ionic.Platform.exitApp();
                        }
                    });
            }
        }

    });
});

app.config(function(localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('krishiBandhu');
});