'use strict';

drawingApp.controller('ScreensIndexController', ['$scope', 'ScreensFactory',
  function($scope, ScreensFactory) {
    $scope.screens = ScreensFactory.all();
}]);

drawingApp.controller('ScreensEditController', 
  ['$scope', '$routeParams', '$filter', 'RectFactory', 'ScreensFactory', 
   'InteractionsFactory',
  function($scope, $routeParams, $filter, RectFactory, ScreensFactory, InteractionsFactory) {
    $scope.screen = ScreensFactory.find($routeParams.slug);
    $scope.rectangles = RectFactory.all();
    InteractionsFactory.init($scope.rectangles);
    $scope.interactions = InteractionsFactory.all();
    $scope.interactionActions = InteractionsFactory.actions();
    $scope.interactionTriggers = InteractionsFactory.triggers();

    $scope.createRect = function() {
      RectFactory.create();
    };

    $scope.inspectShape = function(shape) {
      $scope.inspectedShape = shape;
    };

    $scope.clearInspectedShape = function(e) {
      delete $scope.inspectedShape;
    };

    $scope.clearSelectedShapes = function(e) {
      $scope.rectangles.forEach(function(rect) { rect.deselect(); });
    };

    $scope.createInteraction = function() {
      InteractionsFactory.create();
    };

    $scope.deleteInteraction = function(interaction) {
      InteractionsFactory.destroy(interaction);
    };
  }]);

drawingApp.controller('ScreensShowController', 
  ['$scope', '$routeParams', 'RectFactory', 'ScreensFactory', 
   'InteractionsFactory',
  function($scope, $routeParams, RectFactory, ScreensFactory, InteractionsFactory) {
    $scope.screen = ScreensFactory.find($routeParams.slug);
    $scope.rectangles = RectFactory.all();
    InteractionsFactory.init($scope.rectangles);
    $scope.interactions = InteractionsFactory.all();
  }]);
