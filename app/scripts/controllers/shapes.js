'use strict';

drawingApp.controller('ShapesShowController', ['$scope', function($scope) {
  $scope.shapeClicked = function() {
    console.log("Shape clicked");
  };
}]);
