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
      $scope.currentUser.on('login', function() {
        $location.path('/screens');
      });

      $scope.currentUser.login(email, password);
    };
  }
}(drawingApp));
