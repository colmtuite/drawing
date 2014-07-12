'use strict';

(function (app) {
  app.controller('SessionsNewController', [
    '$scope',
    'CurrentUser',
    '$location',
    ctrl
  ]);

  function ctrl($scope, CurrentUser, $location) {
    $scope.login = function(email, password) {
      $scope.currentUser.login(email, password, function() {
        $location.path('/screens');
      });
    };
  }
}(drawingApp));
