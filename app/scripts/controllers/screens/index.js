'use strict';

(function(app) {
  app.controller('ScreensIndexController', ['$scope', 'Screen', ctrl]);

  function ctrl($scope, Screen) {
    $scope.screens = Screen.$all();

    $scope.newScreen = {};

    $scope.createScreen = function(attrs) {
      Screen.$create(attrs);
      $scope.newScreen = {};
    };

    $scope.destroyScreen = function(uid) {
      Screen.$destroy(uid);
    };

    $scope.updateScreen = function(uid, name) {
      Screen.$update(uid, { name: name });
    };
  }
})(drawingApp);
