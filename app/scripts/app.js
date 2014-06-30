'use strict';

var drawingApp = angular.module('drawingApp', [
  'ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'dnd',
  'angularSelectize', 'ui.bootstrap', "xeditable",
  'firebase'
]);

drawingApp.constant('FBURL', 'https://amber-fire-4613.firebaseio.com/');

drawingApp.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

drawingApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/index.html',
      controller: 'IndexController'
    })
    .when('/screens', {
      templateUrl: 'views/screens/index.html',
      controller: 'ScreensIndexController'
    })
    .when('/screens/:id', {
      templateUrl: 'views/screens/show.html',
      controller: 'ScreensShowController'
    })
    .when('/screens/:id/edit', {
      templateUrl: 'views/screens/edit.html',
      controller: 'ScreensEditController'
    })
    .otherwise({
      redirectTo: '/'
    });
});
