'use strict';

angular.module('angularSelectize', [])
.directive('angularSelectize', ['$compile', '$timeout', '$filter', function($compile, $timeout, $filter) {
  return {
    require: 'ngModel',
    scope: {
      // Pass in a function to be trigged when Selectize changes.
      onChange: '&angularSelectizeOnChange',
      // Pass in a function to call when the user hovers the mouse over one of
      // the selectize items.
      onMouseoverItem: '&angularSelectizeOnMouseoverItem',
      onMouseoutItem: '&angularSelectizeOnMouseoutItem',
      // Same as above but for options.
      onMouseoverOption: '&angularSelectizeOnMouseoverOption',
      onMouseoutOption: '&angularSelectizeOnMouseoutOption',
      // Tell selectize to track changes in a variable on the scope.
      toWatch: '=angularSelectizeWatch',
      // Allow passing in options to pass to selectize.
      selectizeOptions: '@angularSelectizeOptions',
      model: '=ngModel'
    },
    link: function(scope, element, attrs, ngModel) {
      
      // INFO: http://stackoverflow.com/a/17570515/574190
      var onChange = scope.onChange() || angular.noop,
          onMouseoverItem = scope.onMouseoverItem() || angular.noop,
          onMouseoutItem = scope.onMouseoutItem() || angular.noop,
          onMouseoverOption = scope.onMouseoverOption() || angular.noop,
          onMouseoutOption = scope.onMouseoutOption() || angular.noop,
          options,
          selectize,
          select;
      
      // Remove change event bound by select directive; it causes digest errors.
      if (element[0].nodeName === 'SELECT') {
        element.off('change');
      }
      
      scope.selectizeOptions = scope.selectizeOptions || '';
      
      // Check if any options are pased into the diretive like this:
      // selectize="{ someOption: 'something' }".
      if (scope.selectizeOptions.indexOf(':') == -1) {
        options = {};
      } else {
        // Support passing in options without brackets.
        if (scope.selectizeOptions[0] !== '{') {
          scope.selectizeOptions = '{' + scope.selectizeOptions + '}';
        }
        options = scope.$eval('(' + scope.selectizeOptions + ')');
      }
      
      // This is the default delimiter that selectize uses anyway.
      // I need access to it out here so have to redefine it.
      options.delimiter = options.delimiter || ',';
          
      var selectize = element.selectize(options)[0].selectize;
      
      function getValues() {
        return selectize.getValue();
      }

      // Convert the values that Selectize gave us back into objects
      // from the scope before passing them back to the application.
      // If it's a multiple select then we want to return an array,
      // otherwise, the application is expecting a single value back.
      function getObjects() {
        var values = getValues();
        if ($.isArray(values)) {
          return $filter('filter')(scope.toWatch, function(el) {
            console.log("testing if", el, "present in values", $.inArray(el[selectize.settings.valueField], values));
            return $.inArray(el[selectize.settings.valueField], values) !== -1;
          });
        } else {
          return $filter('filter')(scope.toWatch, function(el) {
            return el[selectize.settings.valueField] === values;
          })[0];
        }        
      }
      
      selectize.on('change', (function() {
        $timeout((function() {
          // console.log("Change detected", getValues());
          var objects = getObjects();
          // console.log("Is values array?", $.isArray(values))

          console.log("Returning objects", objects);
          ngModel.$setViewValue(objects);
          onChange(objects);
        }));

      }));

      // Detect hover events
      // -------------------

      // Not sure why but I can't seem to add a mouseover event listenter
      // to the select any other way. I've tried
      //   - using the return value of element.selectize()
      //   - using the return value of element.selectize()[0].selectize
      // Neigher of those work. I've tried both wrapped in a $timeout
      // too and it doesn't seem to make a difference.
      select = angular.element(element.next('.selectize-control'));

      select.on('mouseover', '.option', function() {
        var option = angular.element(this);
        scope.$apply(function() {
          onMouseoverOption(option.data('value'));
        });
      });

      select.on('mouseout', '.option', function() {
        var option = angular.element(this);
        scope.$apply(function() {
          onMouseoutOption(option.data('value'));
        });
      });

      select.on('mouseover', '.item', function() {
        var option = angular.element(this);
        scope.$apply(function() {
          onMouseoverItem(option.data('value'));
        });
      });

      select.on('mouseout', '.item', function() {
        var option = angular.element(this);
        scope.$apply(function() {
          onMouseoutItem(option.data('value'));
        });
      });

      // Rebuild options when underlying model changes
      // ---------------------------------------------

      if (scope.toWatch) {
        scope.$watchCollection("toWatch", (function(newValues) {
          var values = getValues();
          selectize.clearOptions();
          angular.forEach(newValues, (function(option) {
            selectize.addOption(option);
          }));
          // will ignore any that no longer exist
          selectize.setValue(values);
        }));
      }
      
      ngModel.$render = (function() {
        // INFO: http://stackoverflow.com/a/13812399/574190
        var newValues = [].concat(ngModel.$modelValue || []);

        // avoid infinite loop  w/change event
        if (!angular.equals(newValues, getValues())) {
          newValues.forEach(function(val) { 
            // NOTE: I couldn't get selectize.setItem() to work so
            // I'm just accessing the array directly. Also, I'm
            // making the assumption that both the labelField and
            // valueField are set to the same thing here.
            selectize.items.push(val[selectize.settings.valueField])
          });
          selectize.refreshItems();
        }
      });
    }
  };
}]);
