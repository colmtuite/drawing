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

    $scope.newScreen = {};

    $scope.createScreen = function(attrs) {
      angular.extend(attrs, { ownerId: $scope.currentUser.user.$id })
      screens.create(attrs, function(screen) {
        // $scope.currentUser.user.addOwnedScreenId(screen.$id);
        $scope.newScreen = {};
      });
    };

    $scope.destroyScreen = function(screen) {
      screens.destroy(screen, function() {
        // $scope.currentUser.user.removeOwnedScreenId(screen.$id, function() {
        //   screens.remove(screen);
        // });
      });
    };
  }
})(drawingApp);
