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

    $scope.interactionTriggers = InteractionsFactory.triggers();
    $scope.interactionActions = InteractionsFactory.actions();

    InteractionsFactory.init($scope.rectangles);
    $scope.interactions = InteractionsFactory.all();

    $scope.createRect = function() {
      RectFactory.create();
    };

    $scope.changeSelected = function(rectangle) {
      $scope.selectedRectangle = rectangle;
    };
    
    $scope.createInteraction = function() {
      InteractionsFactory.create();
    };

    $scope.deleteInteraction = function(interaction) {
      InteractionsFactory.destroy(interaction);
    };

    $scope.changeSelected($scope.rectangles[0]);
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
