'use strict';

angular.module('angularSelectize', [])
.directive('angularSelectize', ['$compile', '$timeout', function($compile, $timeout) {
  return {
    scope: {
      onChange: '&angularSelectizeOnChange',
      onHighlight: '&angularSelectizeOnHighlight'
    },
    link: function(scope, element, attrs) {
      // INFO: http://stackoverflow.com/a/17570515/574190
      var onChange = scope.onChange() || angular.noop,
          onHighlight = scope.onHighlight() || angular.noop;
      
      $timeout(function() {
        // The selectize() function returns element.
        element.selectize({
          onChange: onChange
        });

        element.next('.selectize-control')
          .on('mouseover', '.option', function() {
            var option = angular.element(this);
            scope.$apply(function() {
              onHighlight(option.data('value'));
            });
          });
      });
    }
  };
}]);
