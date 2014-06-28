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

        scope.$on('keypress:8', function(onEvent, keypressEvent) {
          if (keypressEvent.shiftKey === true) {
            scope.$apply(function() {
              scope.destroySelectedShapes();
            });
          }
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
        // NOTE: If there is three rectagnles on the page, this event will
        // be captured three times. Any functions called in here will be
        // called multiple times.
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
