'use strict';

(function(app) {
  app.controller('ScreensIndexController', [
    '$scope',
    'ScreenCollection',
    ctrl
  ]);

  function ctrl($scope, ScreenCollection) {
    var screens = $scope.currentUser.user.ownedScreens;
    $scope.screens = screens.asArray();

    $scope.currentUser.user.on('load', function() {
      screens._unwrap();
    });

    $scope.newScreen = {};

    $scope.createScreen = function(attrs) {
      angular.extend(attrs, { ownerId: $scope.currentUser.user.$id })
      screens.create(attrs, function(screen) {
        $scope.newScreen = {};
      });
    };

    $scope.destroyScreen = function(screen) {
      screens.destroy(screen);
    };
  }
})(drawingApp);
