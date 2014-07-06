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
    // TODO: The user isn't reloaded every time we reach this page. This 
    // event only triggers when we refresh the page and reload the user.
    // Thus, this event is npt suitable for this purpose.
    $scope.currentUser.user.on('value', function(e) {
      $scope.screens = screens.fetch().asArray();
    });

    $scope.newScreen = {};

    $scope.createScreen = function(attrs) {
      angular.extend(attrs, { ownerId: $scope.currentUser.user.$id })
      screens.create(attrs, function(screen) {
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
