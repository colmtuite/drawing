'use strict';

(function(app) {
  app.controller('ScreensEditController', 
    ['$scope', '$routeParams', '$filter', 'ScreenCollection', 'InspectedRectangle', 'Screen', 'Rectangle', ctrl]);

  function ctrl($scope, $routeParams, $filter, ScreenCollection, InspectedRectangle, Screen, Rectangle) {
    // This is one of the instances where I can't pass in the reference to
    // Firebase and must pass in the ID instead (well, technically I could
    // construct the reference out here with "new Firebase()" but I would
    // rather do that in the model layer). This exemplifies why I do need
    // to retain the ability to infer a  resource from an $id.
    //
    // So far however, I don;t see a reason to be able to lazily calc the
    // reference like I'm doing at the moment with #resource. There should
    // be a method where you pass in an $id and get back a reference. I can
    // then call it in the initializer as needed (like here) or directly
    // (like I need to do with user in the ApplicationController).
    //
    // Another problem is that there's some sort of race condition going on
    // here. Sometimes I refresh the page and don't get any screen data
    // appearing.
    $scope.screen = new Screen({ '$id': $routeParams.id });
    $scope.screen.fetch();

    $scope.rectangles = $scope.screen.rectangles.asArray();

    $scope.createRectangle = function() {
      var attrs = Rectangle.initialAttributes();
      $scope.screen.rectangles.create(attrs);
    };

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
      $scope.selectedShapes.forEach(function(shape) { shape.destroy(); });
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
//      // NOTE: This is being broken by the dnd-selectable="true" directive
//      // on the rectangles. You can notice that the rectangle is not selected
//      // correctly when the page first loads. Removing this directive will
//      // fix this at the expense of making shapes not lasso selectable.
//      $scope.selectOnlyShape($scope.rectangles[0]);
//    });
  }
})(drawingApp);

