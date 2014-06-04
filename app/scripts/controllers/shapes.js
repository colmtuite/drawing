'use strict';

drawingApp.controller('ShapesShowController', ['$scope', function($scope) {
  $scope.shapeClicked = function() {
    console.log('Running shapeClicked in controller');
  };
}]);
