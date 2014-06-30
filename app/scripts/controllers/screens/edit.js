'use strict';

(function(app) {
  app.controller('ScreensEditController', 
    ['$scope', '$routeParams', '$filter', 'ScreenCollection', 'InspectedRectangle', 'Screen', ctrl]);

  function ctrl($scope, $routeParams, $filter, ScreenCollection, InspectedRectangle, Screen) {
    var screens = new ScreenCollection();
    $scope.screen = screens.$find($routeParams.id);
    $scope.rectangles = $scope.screen.rectangles.$all();

    $scope.inspectedShape = InspectedRectangle.inspected();
    $scope.$watch(function() { return InspectedRectangle.inspected(); },
      function(newVal, oldVal) {
        $scope.inspectedShape = newVal;
    });

    // IDEA: Perhaps this should be done by calling "rect.select()" in the
    // view then having a watcher here in the controller to do the rest
    // of this stuff when the "isSelected" value of a shape changes?
    $scope.selectOnlyShape = function(shape) {
      if (typeof shape === "undefined") return;
      $scope.clearSelectedShapes();
      shape.select();
      $scope.selectedShapes.push(shape);
      InspectedRectangle.inspected(shape);
    };

    $scope.clearSelectedShapes = function() {
      $scope.selectedShapes = [];
      $scope.screen.rectangles.deselectAll();
      InspectedRectangle.clear();
    };

    $scope.addSelectedShape = function(shape) {
      shape.select();
      $scope.selectedShapes.push(shape);
      InspectedRectangle.clear();
    };

    $scope.destroySelectedShapes = function() {
      $scope.selectedShapes.forEach(function(shape) {
        shape.$destroy();
      });
      InspectedRectangle.clear();
    };

    // $scope.selectOnlyShape($scope.rectangles.collection[0]);

//      $scope.groups = GroupsFactory.parse(contents.groups);
//
//
//      $scope.createGroup = function() {
//        GroupsFactory.create({ elements: RectFactory.selected() });
//      }
//
     $scope.saveScreen = function() {
       console.log("Saving screen", $scope);
       $scope.screen.$save();
     }
//
//      // NOTE: This is being broken by the dnd-selectable="true" directive
//      // on the rectangles. You can notice that the rectangle is not selected
//      // correctly when the page first loads. Removing this directive will
//      // fix this at the expense of making shapes not lasso selectable.
//      $scope.selectOnlyShape($scope.rectangles[0]);
//    });
  }
})(drawingApp);

