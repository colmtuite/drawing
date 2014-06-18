'use strict';

drawingApp.controller('ScreensIndexController', ['$scope', 'ScreensFactory',
  function($scope, ScreensFactory) {
    $scope.screens = ScreensFactory.all();
}]);

drawingApp.controller('ScreensEditController', 
  ['$scope', '$routeParams', '$filter', 'RectFactory', 'ScreensFactory', 
   'InteractionsFactory', 'GroupsFactory',
  function($scope, $routeParams, $filter, RectFactory, ScreensFactory, InteractionsFactory, GroupsFactory) {
    $scope.screen = ScreensFactory.find($routeParams.slug);
    $scope.rectangles = RectFactory.all();
    InteractionsFactory.init($scope.rectangles);
    $scope.interactions = InteractionsFactory.all();
    $scope.interactionActions = InteractionsFactory.actions();
    $scope.interactionTriggers = InteractionsFactory.triggers();
    $scope.groups = GroupsFactory.all();

    $scope.interactionElements = function() {
      return $scope.rectangles.concat($scope.groups);
    };

    $scope.createRect = function() {
      RectFactory.create();
    };

    $scope.inspectShape = function(shape) {
      $scope.inspectedShape = shape;
    };

    $scope.clearInspectedShape = function(e) {
      delete $scope.inspectedShape;
    };

    $scope.createInteraction = function() {
      InteractionsFactory.create();
    };

    $scope.deleteInteraction = function(interaction) {
      InteractionsFactory.destroy(interaction);
    };

    $scope.createGroup = function() {
      var elements = $filter('filter')($scope.rectangles, {isSelected: true});
      GroupsFactory.create({ elements: elements });
    };
  }]);

drawingApp.controller('ScreensShowController', 
  ['$scope', '$routeParams', 'RectFactory', 'ScreensFactory', 
   'InteractionsFactory', 'GroupsFactory',
  function($scope, $routeParams, RectFactory, ScreensFactory, InteractionsFactory, GroupsFactory) {
    $scope.screen = ScreensFactory.find($routeParams.slug);
    $scope.rectangles = RectFactory.all();
    InteractionsFactory.init($scope.rectangles);
    $scope.interactions = InteractionsFactory.all();
    $scope.groups = GroupsFactory.all();
  }]);
