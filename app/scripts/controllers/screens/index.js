'use strict';

(function(app) {
  app.controller('ScreensIndexController', [
    '$scope',
    'ScreenCollection',
    ctrl
  ]);

  function ctrl($scope, ScreenCollection) {
    var screens = $scope.currentUser.ownedScreens;
    $scope.screens = screens.collection;

    $scope.newScreen = {};

    $scope.createScreen = function(attrs) {
      angular.extend(attrs, { ownerId: $scope.currentUser.uid })
      screens.$create(attrs, function(screen) {
        $scope.currentUser.$addOwnedScreenId(screen.uid);
        $scope.newScreen = {};
      });
    };
  }
})(drawingApp);
