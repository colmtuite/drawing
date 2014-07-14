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

    $scope.currentUser.user.on('value', function() {
      // I'm doing this in here rather than in the user model because I don't
      // want to fetch and unwrap the user's screens everytime the user loads.
      // Otherwise it would load all screens on all pages.
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
