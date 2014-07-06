'use strict';

(function(app) {
  app.controller('ScreensIndexController', [
    '$scope',
    'ScreenCollection',
    ctrl
  ]);

  function ctrl($scope, ScreenCollection) {
    var screens = $scope.currentUser.user.ownedScreens;

    // Can't fetch unti we have downloaded the screen ids in the user data.
    $scope.currentUser.user.on('loaded', function(e) {
      $scope.screens = screens.fetch().asArray();
    });

    $scope.newScreen = {};

    $scope.createScreen = function(attrs) {
      console.log("The current user", $scope.currentUser);
      angular.extend(attrs, { ownerId: $scope.currentUser.user.$id })
      screens.create(attrs, function(screen) {
        console.log("Adding the id", screen);
        $scope.currentUser.user.addOwnedScreenId(screen.$id);
        $scope.newScreen = {};
      });
    };

    $scope.destroyScreen = function(screen) {
      screen.destroy(function() {
        $scope.currentUser.user.removeOwnedScreenId(screen.$id, function() {
          screens.remove(screen);
        });
      });
    };
  }
})(drawingApp);
