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
    // TODO: Rename to elementInteractions to represent the fact that these are
    // interactions between elements.
    $scope.interactions = InteractionsFactory.all();
    // TODO: Rename to elementInteractionActions.
    $scope.interactionActions = InteractionsFactory.actions();
    // This name is ok since these triggers are used on state and element
    // interactions.
    $scope.interactionTriggers = InteractionsFactory.triggers();
    $scope.groups = GroupsFactory.all();
    $scope.stateInteractions = InteractionsFactory.all('stateInteractions');

    $scope.interactionElements = function() {
      return $scope.rectangles.concat($scope.groups);
    };

    $scope.createRect = function() {
      RectFactory.create();
    };

    $scope.selectOnlyShape = function(shape) {
      $scope.clearSelectedShapes();
      shape.select();
      $scope.selectedShapes.push(shape);
      $scope.inspectedShape = shape;
    };

    $scope.addSelectedShape = function(shape) {
      shape.select();
      $scope.selectedShapes.push(shape);
      delete $scope.inspectedShape;
    };

    $scope.clearSelectedShapes = function(e) {
      $scope.selectedShapes = [];
      $scope.rectangles.forEach(function(el) { el.deselect(); });
      delete $scope.inspectedShape;
    };

    $scope.createInteraction = function() {
      // Initialize the new state with some data so that the select boxes
      // are preset with some value when the user sees them.
      InteractionsFactory.create({
        actor: $scope.inspectedShape,
        trigger: $scope.interactionTriggers[0],
        action: $scope.interactionActions[0]
      });
    };

    $scope.deleteInteraction = function(interaction) {
      InteractionsFactory.destroy(interaction);
    };

    $scope.createStateInteraction = function() {
      InteractionsFactory.createState({
        actor: $scope.inspectedShape,
        trigger: $scope.interactionTriggers[0],
        newState: $scope.inspectedShape.states[1]
      });
    };

    $scope.deleteStateInteraction = function(interaction) {
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

    // NOTE: This is being broken by the dnd-selectable="true" directive
    // on the rectangles. You can notice that the rectangle is not selected
    // correctly when the page first loads. Removing this directive will
    // fix this at the expense of making shapes not lasso selectable.
    $scope.selectOnlyShape($scope.rectangles[0]);
  }]);

drawingApp.controller('ScreensShowController', 
  ['$scope', '$routeParams', 'RectFactory', 'ScreensFactory', 
   'InteractionsFactory', 'GroupsFactory',
  function($scope, $routeParams, RectFactory, ScreensFactory, InteractionsFactory, GroupsFactory) {
    $scope.screen = ScreensFactory.find($routeParams.slug);
    $scope.rectangles = RectFactory.all();
    $scope.interactions = InteractionsFactory.all();
    $scope.stateInteractions = InteractionsFactory.all('stateInteractions');
    $scope.groups = GroupsFactory.all();
  }]);
