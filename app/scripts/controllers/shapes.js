'use strict';

drawingApp.controller('ShapesShowController', ['$scope', function($scope) {
  $scope.rectClicked = function() {
    console.log("Rect clicked");
  };
}]);
