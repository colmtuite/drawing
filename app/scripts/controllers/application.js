'use strict';

(function(app) {
  app.controller('ApplicationController', [
    '$scope',
    'CurrentUser',
    'User',
    ctrl
  ]);

  function ctrl($scope, CurrentUser, User) {
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
      console.log("login encountered", user);
      angular.extend($scope.currentUser.user, angular.extend(user, {
        '$id': user.id
      }));
      // Fetch the user's data record.
      $scope.currentUser.user.fetch();
      $scope.isLoggedIn = true;
    });
  }
})(drawingApp);
