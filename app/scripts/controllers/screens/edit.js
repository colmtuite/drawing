'use strict';

(function(app) {
  app.controller('ScreensEditController', 
    ['$scope', '$routeParams', '$filter', 'RectFactory', 'ScreensFactory', 
     'InteractionsFactory', 'GroupsFactory', ctrl]);

  function ctrl($scope, $routeParams, $filter, RectFactory, ScreensFactory, InteractionsFactory, GroupsFactory) {
    ScreensFactory.find($routeParams.slug).then(function(resp) {
      $scope.screen = resp.screen;
      var contents = JSON.parse(resp.screen.contents) || [];
      console.log("Contents", contents);
      $scope.rectangles = RectFactory.parse(contents.rectangles);
      $scope.groups = GroupsFactory.parse(contents.groups);

      $scope.inspectedShape = RectFactory.inspectedShape();
      $scope.$watch(function() { return RectFactory.inspectedShape(); },
        function(newVal, oldVal) {
          $scope.inspectedShape = newVal;
      });

      $scope.createRect = function() {
        RectFactory.create();
      };

      $scope.selectOnlyShape = function(shape) {
        if (typeof shape === "undefined") return;
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

      $scope.destroySelectedShapes = function() {
        RectFactory.selected().forEach(function(el) {
          RectFactory.destroy(el);
        });
        $scope.clearSelectedShapes();
      }

      $scope.createGroup = function() {
        GroupsFactory.create({ elements: RectFactory.selected() });
      }

      $scope.saveScreen = function() {
        var attrs = $.extend($scope.screen, {
          contents: JSON.stringify({
            rectangles: RectFactory.toJSON(),
            groups: GroupsFactory.toJSON()
          })
        });
        console.log("Saving screen", $scope);
        return ScreensFactory.update($scope.screen, attrs);
      }

      // NOTE: This is being broken by the dnd-selectable="true" directive
      // on the rectangles. You can notice that the rectangle is not selected
      // correctly when the page first loads. Removing this directive will
      // fix this at the expense of making shapes not lasso selectable.
      $scope.selectOnlyShape($scope.rectangles[0]);
    });
  }
})(drawingApp);

