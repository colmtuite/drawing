// NOTES:
//
// http://jasonmore.net/angular-js-svg-directives-ng-repeat-templates/
// http://stackoverflow.com/a/19599950/574190
// https://docs.angularjs.org/guide/directive

(function(app) {
  var isPublic = function(attrName, value) {
    return value !== null && !attrName.match(/\$/) && (typeof value !== 'string' || value !== '');
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

  app.directive('drShape', ['$compile', function($compile) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var shape = makeNode(scope.shape.tagName, element, attrs);
        var elementShape = angular.element(shape);

        for (var attribute in scope.shape) {
          if (isPublic(attribute, scope.shape[attribute])) {
            bindNgAttr(elementShape, attribute);
          }
        }
        elementShape.attr('ng-controller', 'ShapesShowController');
        elementShape.attr('ng-click', 'shapeClicked()');
        element.replaceWith(shape);

        attrs.$observe('value', function(value) {
          scope['value'] = parseInt(value, 10);
          $compile(shape)(scope);
        });
      }
    };
  }]);
})(drawingApp);
