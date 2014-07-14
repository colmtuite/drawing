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

    // If I trigger a 'load' event when the first user 'value' event is
    // detected then it doesn't get retriggered when the user simply moves
    // from page to page (rather than refreshing).
    //
    // If I listen to the user's 'load' event then it get's triggered whenever
    // the user data changes and changing (for example) the user's email
    // address will re-trigger this listener and unwrap the screens again
    // unnexessarily. This leans to crazy stuff happening like screens being
    // displayed twice.
    $scope.currentUser.user.on('load', function() {
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
