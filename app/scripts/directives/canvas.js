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
              scope.clearInspectedShape();
            });
          }
        });
      }
    };
  }]);
})(drawingApp);