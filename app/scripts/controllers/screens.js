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

    $scope.selectShape = function(shape) {
      $scope.clearSelectedShapes();
      shape.select();
      $scope.selectedShape = shape;
    };


    $scope.clearSelectedShapes = function(e) {
      delete $scope.selectedShape;
      $scope.rectangles.forEach(function(el) { el.deselect(); });
    };

    $scope.createInteraction = function() {
      InteractionsFactory.create({
        actor: $scope.selectedShape,
        trigger: $scope.interactionTriggers[0],
        action: $scope.interactionActions[0]
      });
    };

    $scope.deleteInteraction = function(interaction) {
      InteractionsFactory.destroy(interaction);
    };

    $scope.createGroup = function() {
      var elements = $filter('filter')($scope.rectangles, {isSelected: true});
      GroupsFactory.create({ elements: elements });
    };

    $scope.highlightElement = function(name) {
      $scope.unhighlightAll();
      var elements = $scope.interactionElements();
      $filter('filter')(elements, function(el) {
        return el.name === name;
      }).map(function(el) {
        el.isHighlighted = true;
      });
    };

    $scope.unhighlightAll = function() {
      var elements = $scope.interactionElements();
      elements.forEach(function(el) { el.isHighlighted = false });
    }

    $scope.setActees = function(actees) {
      console.log('Setting the actees', actees);
    };

    // The index we're using here must match the actor in the initialized
    // interaction. This is a termporary hack.
    // NOTE: This is being broken by the dnd-selectable="true" directive
    // on the rectangles. You can notice that the rectangle is not selected
    // correctly when the page first loads. Removing this directive will
    // fix this at the expense of making shapes not lasso selectable.
    $scope.selectShape($scope.rectangles[0]);
  }]);

drawingApp.controller('ScreensShowController', 
  ['$scope', '$routeParams', 'RectFactory', 'ScreensFactory', 
   'InteractionsFactory', 'GroupsFactory',
  function($scope, $routeParams, RectFactory, ScreensFactory, InteractionsFactory, GroupsFactory) {
    $scope.screen = ScreensFactory.find($routeParams.slug);
    $scope.rectangles = RectFactory.all();
    $scope.interactions = InteractionsFactory.all();
    $scope.groups = GroupsFactory.all();
  }]);
