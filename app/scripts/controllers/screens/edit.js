'use strict';

(function(app) {
  app.controller('ScreensEditController', 
    ['$scope', '$routeParams', '$filter', 'RectangleCollection', 'Screen', ctrl]);

  function ctrl($scope, $routeParams, $filter, RectangleCollection, Screen) {
    $scope.screen = Screen.$find($routeParams.id);

    $scope.inspectedShape = RectangleCollection.inspectedShape();
    $scope.$watch(function() { return RectangleCollection.inspectedShape(); },
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
      RectangleCollection.inspectedShape(shape);
    };

    $scope.clearSelectedShapes = function() {
      $scope.selectedShapes = [];
      // TODO: Move this into the model.
      angular.forEach($scope.screen.rectangles.collection, function(rect, key) {
        rect.deselect();
      });
      RectangleCollection.clearInspectedShape();
    };

    $scope.addSelectedShape = function(shape) {
      shape.select();
      $scope.selectedShapes.push(shape);
      Rectangle.clearInspectedShape();
    };

    $scope.destroySelectedShapes = function(shape) {
      $scope.screen.rectangles.$destroy($scope.selectedShapes);
      RectangleCollection.clearInspectedShape();
    };

    // $scope.selectOnlyShape($scope.rectangles.collection[0]);

//      $scope.groups = GroupsFactory.parse(contents.groups);
//
//
//      $scope.createGroup = function() {
//        GroupsFactory.create({ elements: RectFactory.selected() });
//      }
//
//      $scope.saveScreen = function() {
//        var attrs = $.extend($scope.screen, {
//          contents: JSON.stringify({
//            rectangles: RectFactory.toJSON(),
//            groups: GroupsFactory.toJSON()
//          })
//        });
//        console.log("Saving screen", $scope);
//        return ScreensFactory.update($scope.screen, attrs);
//      }
//
//      // NOTE: This is being broken by the dnd-selectable="true" directive
//      // on the rectangles. You can notice that the rectangle is not selected
//      // correctly when the page first loads. Removing this directive will
//      // fix this at the expense of making shapes not lasso selectable.
//      $scope.selectOnlyShape($scope.rectangles[0]);
//    });
  }
})(drawingApp);

