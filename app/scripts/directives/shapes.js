// NOTES:
//
// http://jasonmore.net/angular-js-svg-directives-ng-repeat-templates/
// http://stackoverflow.com/a/19599950/574190
// https://docs.angularjs.org/guide/directive

(function(app) {
  var isPublic = function(attrName, value) {
    return value !== null && !attrName.match(/\$/) && 
      (typeof value !== 'string' || value !== '');
  };

  /* Create a shape node with the given settings. */
  var makeNode = function(name, element, settings) {
    var namespace = 'http://www.w3.org/2000/svg';
    var node = document.createElementNS(namespace, name);
    for (var attribute in settings) {
      var value = settings[attribute];
      if (isPublic(attribute, value)) {
        node.setAttribute(attribute, value);
      }
    }
    return node;
  }

  var bindNgAttr = function(el, attribute, value) {
    el.attr('ng-attr-' + attribute, '{{shape.' + attribute + '}}');
  };

  app.directive('drRect', ['$compile', function($compile) {
    return {
      restrict: 'E',
      scope: true,
      link: function(scope, element, attrs, ctrl) {
        var node = makeNode('rect', element, attrs);
        var shape = angular.element(node);
        var originalShapeX, originalShapeY,
            originalMouseX, originalMouseY;
        
        scope.$watch('shape', function(newVal, oldVal) {
          for (var key in newVal) {
            if (newVal.hasOwnProperty(key) && isPublic(key, newVal[key])) {
              if (newVal[key] !== oldVal[key]) {
                shape.attr(key, newVal[key]);
              }
            }
          }
        }, true);

        shape.on('dblclick', function() {
          scope.$apply(function() {
            scope.changeSelected(scope.shape);
          });
        });

        var moveShape = function(e) {
          var dx = originalMouseX - e.clientX;
          var dy = originalMouseY - e.clientY;

          scope.$apply(function() {
            scope.shape.x = originalShapeX - dx;
            scope.shape.y = originalShapeY - dy;
          });
        };

        shape.on('mousedown', function(e) {
          originalShapeX = scope.shape.x;
          originalShapeY = scope.shape.y;
          originalMouseX = e.clientX;
          originalMouseY = e.clientY;

          shape.on('mousemove', moveShape);
          shape.on('mouseup', function() {
            shape.off('mousemove', moveShape)
          });
        });

        element.replaceWith(node);

        attrs.$observe('value', function(value) {
          scope['value'] = parseInt(value, 10);
          $compile(node)(scope);
        });
      }
    };
  }]);
})(drawingApp);
