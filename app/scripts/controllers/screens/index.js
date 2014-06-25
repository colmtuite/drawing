'use strict';

(function(app) {
  app.controller('ScreensIndexController', ['$scope', 'ScreensFactory', ctrl]);

  function ctrl($scope, ScreensFactory) {
    ScreensFactory.all().then(function(response) {
      $scope.screens = response.screens;
    });

    $scope.newScreen = {};

    $scope.createScreen = function(attrs) {
      ScreensFactory.create(attrs).then(function(response) {
        console.log("Created. Response", response.screen);
        $scope.screens.push(response.screen);
        $scope.newScreen = {};
      });
    }

    $scope.destroyScreen = function(screen) {
      ScreensFactory.destroy(screen).then(function(resp) {
        var index = $scope.screens.indexOf(screen);
        $scope.screens.splice(index, 1);
      });
    }

    $scope.updateScreen = function(screen, name) {
      return ScreensFactory.update(screen, { name: name });
    }
  }
})(drawingApp);
