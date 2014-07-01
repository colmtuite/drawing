'use strict';

(function (app) {
  app.controller('RegistrationsNewController', [
    '$scope',
    'CurrentUser',
    '$location',
    ctrl
  ]);

  function ctrl($scope, CurrentUser, $location) {
    $scope.createUser = function(email, password) {
      CurrentUser.$create(email, password)
        .then(function(user) {
          $location.path('/screens');
        })
        .catch(function(err) {
          console.log("Error creating", err);
        });
    };
  }
}(drawingApp));
