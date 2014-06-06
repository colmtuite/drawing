'use strict';

drawingApp.controller('ScreensIndexController', ['$scope', 'ScreensFactory',
  function($scope, ScreensFactory) {
    $scope.screens = ScreensFactory.all();
}]);

drawingApp.controller('ScreensShowController', 
  ['$scope', '$routeParams', '$filter', 'RectFactory', 'ScreensFactory',
  function($scope, $routeParams, $filter, RectFactory, ScreensFactory) {
    $scope.screen = ScreensFactory.find($routeParams.slug);
    $scope.rectangles = RectFactory.all();

    $scope.createRect = function() {
      RectFactory.create();
    };

    $scope.changeSelected = function(rectangle) {
      $scope.selectedRectangle = rectangle;
    };
    
    $scope.changeSelected($scope.rectangles[0]);
  }]);
