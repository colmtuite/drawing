'use strict';

var drawingApp = angular.module('drawingApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
]);

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
    .when('/screens/:slug', {
      templateUrl: 'views/screens/show.html',
      controller: 'ScreensShowController'
    })
    .when('/screens/:slug/edit', {
      templateUrl: 'views/screens/edit.html',
      controller: 'ScreensEditController'
    })
    .otherwise({
      redirectTo: '/'
    });
});
