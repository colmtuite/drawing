'use strict';

(function(app) {
  app.controller('ApplicationController', [
    '$scope',
    'CurrentUser',
    '$location',
    ctrl
  ]);

  function ctrl($scope, CurrentUser, $location) {
    $scope.isLoggedIn = false;
    // Even though we're not logged in a this point, it's handy to have an
    // object so that we don't get exceptions when we call methods on it
    // further down the line.
    $scope.currentUser = new CurrentUser();

    $scope.currentUser.on('login', function() {
      $scope.isLoggedIn = true;

      $scope.logout = function() {
        $scope.currentUser.logout();
      };
    });

    $scope.currentUser.on('logout', function() {
      $scope.isLoggedIn = false;
      $location.path('/');
    });

    $scope.currentUser.authenticate();

  }
})(drawingApp);
