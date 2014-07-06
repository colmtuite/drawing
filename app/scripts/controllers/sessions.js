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
      CurrentUser.login(email, password)
        .then(function(user) {
          $location.path('/screens');
        })
        .catch(function(error) {
          console.error(error);
        });
    };
  }
}(drawingApp));
