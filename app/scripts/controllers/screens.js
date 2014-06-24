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
    $scope.groups = GroupsFactory.all();

    $scope.inspectedShape = RectFactory.inspectedShape();
    $scope.$watch(function() { return RectFactory.inspectedShape(); },
      function(newVal, oldVal) {
        $scope.inspectedShape = newVal;
    });

    $scope.createRect = function() {
      RectFactory.create();
    };

    $scope.selectOnlyShape = function(shape) {
      $scope.clearSelectedShapes();
      shape.select();
      $scope.selectedShapes.push(shape);
      RectFactory.inspectedShape(shape);
    };

    $scope.addSelectedShape = function(shape) {
      shape.select();
      $scope.selectedShapes.push(shape);
      RectFactory.clearInspectedShape();
    };

    $scope.clearSelectedShapes = function(e) {
      $scope.selectedShapes = [];
      $scope.rectangles.forEach(function(el) { el.deselect(); });
      RectFactory.clearInspectedShape();
    };

    $scope.createGroup = function() {
      var elements = $filter('filter')($scope.rectangles, {isSelected: true});
      GroupsFactory.create({ elements: elements });
    };

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
