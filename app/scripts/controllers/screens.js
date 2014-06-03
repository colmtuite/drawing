'use strict';

drawingApp.controller('ScreensIndexController', ['$scope', 'ScreensFactory',
  function($scope, ScreensFactory) {
    $scope.screens = ScreensFactory.all();
}]);

drawingApp.controller('ScreensShowController', 
  ['$scope', '$routeParams', '$filter', 'ShapesFactory', 'ScreensFactory',
  function($scope, $routeParams, $filter, ShapesFactory, ScreensFactory) {
    $scope.screen = ScreensFactory.find($routeParams.slug);
    $scope.shapes = ShapesFactory.all();

    $scope.createRect = function() {
      ShapesFactory.create('rect');
    };

    $scope.createCircle = function() {
      ShapesFactory.create('circle');
    };
  }]);
