drawingApp.directive('drCanvas', ['$compile', function($compile) {
  return {
    link: function(scope, element, attrs) {
      element.on('click', function(e) {
        scope.$apply(function() {
          if (angular.element(e.target).is(element)) {
            scope.clearInspectedShape();
          }
        });
      });
    }
  };
}]);
