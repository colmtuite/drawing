'use strict';

(function(app) {
  app.controller('ScreensIndexController', ['$scope', 'ScreensFactory', ctrl]);

  function ctrl($scope, ScreensFactory) {
    ScreensFactory.all().then(function(response) {
      $scope.screens = response.screens;
    });

    $scope.newScreen = {};

    $scope.createScreen = function(attrs) {
      ScreensFactory.create(attrs).then(function(response) {
        console.log("Created. Response", response.screen);
        $scope.screens.push(response.screen);
        $scope.newScreen = {};
      });
    }

    $scope.destroyScreen = function(screen) {
      ScreensFactory.destroy(screen).then(function(resp) {
        var index = $scope.screens.indexOf(screen);
        $scope.screens.splice(index, 1);
      });
    }
  }
})(drawingApp);

(function(app) {
  app.controller('ScreensEditController', 
    ['$scope', '$routeParams', '$filter', 'RectFactory', 'ScreensFactory', 
     'InteractionsFactory', 'GroupsFactory', ctrl]);

  function ctrl($scope, $routeParams, $filter, RectFactory, ScreensFactory, InteractionsFactory, GroupsFactory) {
    ScreensFactory.find($routeParams.slug).then(function(resp) {
      $scope.screen = resp.screen;
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
    });
  }
})(drawingApp);

(function(app) {
  app.controller('ScreensShowController', 
    ['$scope', '$routeParams', 'RectFactory', 'ScreensFactory', 
     'InteractionsFactory', 'GroupsFactory', ctrl]);

  function ctrl($scope, $routeParams, RectFactory, ScreensFactory, InteractionsFactory, GroupsFactory) {
    ScreensFactory.find($routeParams.slug).then(function(resp) {
      $scope.screen = resp.screen;
      $scope.rectangles = RectFactory.all();
      $scope.interactions = InteractionsFactory.all();
      $scope.stateInteractions = InteractionsFactory.all('stateInteractions');
      $scope.groups = GroupsFactory.all();
    });
  }
})(drawingApp);
