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
    $scope.actorNames = $scope.rectangles.map(function(rect) {
      return { name: rect.name };
    });

    $scope.interactions = [{
      actor: $scope.actorNames[0],
      actee: $scope.actorNames[1],
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

    $scope.deleteInteraction = function(interaction) {
      var index = $scope.interactions.indexOf(interaction)
      $scope.interactions.splice(index, 1);   
    };

    $scope.changeSelected($scope.rectangles[0]);
  }]);
