drawingApp.directive('drDraggable', ['$compile', function($compile) {
  return {
    link: function(scope, element, attrs) {
      var originalShapeX, originalShapeY,
          originalMouseX, originalMouseY;

      var moveShape = function(e) {
        var dx = originalMouseX - e.clientX;
        var dy = originalMouseY - e.clientY;

        scope.$apply(function() {
          scope.rect.x = originalShapeX - dx;
          scope.rect.y = originalShapeY - dy;
        });
      };

      var mouseUp = function() {
        element.off('mousemove', moveShape)
        element.off('mouseup', mouseUp)
      };

      element.on('mousedown', function(e) {
        e.preventDefault();
        originalShapeX = scope.rect.x;
        originalShapeY = scope.rect.y;
        originalMouseX = e.clientX;
        originalMouseY = e.clientY;

        element.on('mousemove', moveShape);
        element.on('mouseup', mouseUp);
      });
    }
  };
}]);
