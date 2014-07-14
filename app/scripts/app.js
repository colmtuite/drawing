'use strict';

var drawingApp = angular.module('drawingApp', [
  'ngCookies', 'ngResource', 'ngSanitize', 'dnd',
  'angularSelectize', "xeditable", 'ui.router',
  'config'
]);

drawingApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('root', {
      url: '/',
      templateUrl: 'views/index.html'
    })
    .state('screens', {
      url: '/screens',
      templateUrl: 'views/screens/index.html',
      controller: 'ScreensIndexController'
    })
    .state('new-registration', {
      url: '/registrations/new',
      templateUrl: 'views/registrations/new.html',
      controller: 'RegistrationsNewController'
    })
    .state('new-session', {
      url: '/sessions/new',
      templateUrl: 'views/sessions/new.html',
      controller: 'SessionsNewController'
    })
    .state('screen', {
      url: '/screens/:id',
      templateUrl: 'views/screens/show.html',
      controller: 'ScreensShowController'
    })
    .state('edit-screen', {
      url: '/screens/:id/edit',
      templateUrl: 'views/screens/edit.html',
      controller: 'ScreensEditController'
    })
});
