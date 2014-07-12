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
      $scope.currentUser.create(email, password, function(error, user) {
        if (error) {
          console.log("ERROR", error);
        } else {
          $scope.currentUser.login(email, password, function(user) {
            // Save the user's DB record (which is different than the details
            // that Firebase tracks so they can handle authentication).
            user.save();
            $location.path('/screens');
          });
        }
      });
    };
  }
}(drawingApp));
