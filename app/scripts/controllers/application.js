'use strict';

(function(app) {
  app.controller('ApplicationController', [
    '$scope',
    'CurrentUser',
    'User',
    'FBURL',
    ctrl
  ]);

  function ctrl($scope, CurrentUser, User, FBURL) {
    $scope.isLoggedIn = false;
    // Even though we're not logged in a this point, it's handy to have an
    // object so that we don't get exceptions when we call methods on it
    // further down the line.
    $scope.currentUser = new CurrentUser();

    $scope.logout = function() {
      $scope.isLoggedIn = false;
      CurrentUser.$logout();
    };

    $scope.$on('$firebaseSimpleLogin:login', function(e, user) {
      angular.extend($scope.currentUser.user, user);
      // We have to do this manually in this instance because we're using
      // the User model outside of a collection.
      $scope.currentUser.user._resource = new Firebase(FBURL + 'users/' + user.id);
      // Fetch the user's data record.
      $scope.currentUser.user.fetch();
      $scope.isLoggedIn = true;
    });
  }
})(drawingApp);
