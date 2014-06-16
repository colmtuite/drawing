'use strict';

drawingApp.controller('ScreensIndexController', ['$scope', 'ScreensFactory',
  function($scope, ScreensFactory) {
    $scope.screens = ScreensFactory.all();
}]);

drawingApp.controller('ScreensEditController', 
  ['$scope', '$routeParams', '$filter', 'RectFactory', 'ScreensFactory',
  function($scope, $routeParams, $filter, RectFactory, ScreensFactory) {
    $scope.screen = ScreensFactory.find($routeParams.slug);
    $scope.rectangles = RectFactory.all();

    $scope.interactionTriggers = [{ name: 'click' }];
    $scope.interactionActions = [{ name: 'hide' }];

    $scope.interactions = [{
      actor: 'one',
      actee: 'two',
      action: $scope.interactionActions[0],
      trigger: $scope.interactionTriggers[0]
    }];

    $scope.createRect = function() {
      RectFactory.create();
    };

    $scope.changeSelected = function(rectangle) {
      $scope.selectedRectangle = rectangle;
    };
    
    $scope.createInteraction = function() {
      $scope.interactions.push({});
    };

    $scope.changeSelected($scope.rectangles[0]);
  }]);
