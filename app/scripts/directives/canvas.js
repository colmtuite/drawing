'use strict';

(function(app) {
  app.directive('drCanvas', ['$compile', function($compile) {
    return {
      link: function(scope, element, attrs) {
        var isCanvas = function(target) {
          return angular.element(target).is(element);
        };

        element.on('click', function(e) {
          if (isCanvas(e.target)) {
            scope.$apply(function() {
              scope.clearSelectedShapes();
            });
          }
        });

        scope.$on('keypress:71', function(onEvent, keypressEvent) {
          scope.createGroup();
        });
      }
    };
  }]);

  app.directive('drRect', ['$compile', '$parse', function($compile, $parse) {
    return {
      restrict: 'A',
      scope: {
        onShiftClick: '&drRectShiftClick',
        onShiftlessClick: '&drRectShiftlessClick'
      },
      link: function(scope, element, attrs) {
        element.on('click', function(e) {
          if (e.shiftKey) {
            scope.$apply(function() { scope.onShiftClick(); });
          } else {
            scope.$apply(function() { scope.onShiftlessClick(); });
          }
        });
      }
    };
  }]);
})(drawingApp);
