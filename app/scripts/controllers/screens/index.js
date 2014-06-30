'use strict';

(function(app) {
  app.controller('ScreensIndexController', ['$scope', 'ScreenCollection', ctrl]);

  function ctrl($scope, ScreenCollection) {
    var screens = new ScreenCollection();
    $scope.screens = screens.$all();

    $scope.newScreen = {};

    $scope.createScreen = function(attrs) {
      screens.$create(attrs);
      $scope.newScreen = {};
    };
  }
})(drawingApp);
