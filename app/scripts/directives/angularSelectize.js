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
      toWatch: '&angularSelectizeWatch',
      // Allow passing in options to pass to selectize.
      selectizeOptions: '@angularSelectizeOptions'
    },
    link: function(scope, element, attrs, ngModel) {
      // INFO: http://stackoverflow.com/a/17570515/574190
      var onChange = scope.onChange || angular.noop,
          onMouseoverItem = scope.onMouseoverItem() || angular.noop,
          onMouseoutItem = scope.onMouseoutItem || angular.noop,
          onMouseoverOption = scope.onMouseoverOption() || angular.noop,
          onMouseoutOption = scope.onMouseoutOption || angular.noop,
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

      // Convert the values that Selectize gave us back into objects
      // from the scope before passing them back to the application.
      // If it's a multiple select then we want to return an array,
      // otherwise, the application is expecting a single value back.
      function getObjects() {
        var values = selectize.getValue(),
            watches = scope.toWatch();
        
        // We have to be able to handle both the case where we're watching
        // an array (either of strings, numbers or objects) like this:
        //
        //   [{ 
        //     name: 'Tabby',
        //     color: 'green'
        //   }, { 
        //     name: 'Fluffy',
        //     color: 'red'
        //   }]
        //
        // AND the case where we're watching an object like this:
        //
        //  { 
        //    'Tabby': {
        //      color: 'green'
        //    },
        //    'Fluffy': {
        //      color: 'red'
        //    }
        //  }
        //
        
        if (angular.isArray(watches)) {
          // This first branch takes care of multiple selects. In this case,
          // values will be an array because it must (obviously) be able to 
          // contain multiple selected values at any one time.
          if (angular.isArray(values)) {
            return $filter('filter')(watches, function(el) {
              if ($.isPlainObject(el)) {
                return $.inArray(el[selectize.settings.valueField], values) !== -1;
              } else {
                return $.inArray(el, values) !== -1;
              }
            });
          } else {
            return $filter('filter')(watches, function(el) {
              if ($.isPlainObject(el)) {
                return el[selectize.settings.valueField] === values;
              } else {
                return el === values;
              }
            })[0];
          }
        } else {
          return values;
        }
      }
      
      selectize.on('change', (function() {
        $timeout((function() {
          var objects = getObjects();
          ngModel.$setViewValue(objects);
          onChange();
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
        scope.$watchCollection(scope.toWatch, (function(newValues) {
          var values = selectize.getValue();
          
          selectize.clearOptions();
          
          // We need to be able to handle the case where toWatch is an object
          // (i.e. not an array) and when it is an actual array.
          //
          // Iterating over an object is slightly different than iterating
          // over an array.
          if (angular.isArray(newValues)) {
            angular.forEach(newValues, (function(data, index) {
              var option;
              // Deal with an plain string or number.
              if (typeof data !== "object") {
                option = {};
                option.value = option.text = data;
              // Deal with an object.
              } else {
                option = data;
              }
              selectize.addOption(option);
            }));
          } else {
            angular.forEach(newValues, (function(details, name) {
              var option = {};
              // TODO: Raise an exception if we're in this branch AND either
              // the labelField or valueField options are set.
              option.value = option.text = name;
              selectize.addOption(option);
            }));
          }
          
          // Will ignore any that no longer exist
          selectize.setValue(values);
        }));
      }
      
      // Render the select with the ngModel already selected
      // ---------------------------------------------------
      
      ngModel.$render = (function() {
        // INFO: http://stackoverflow.com/a/13812399/574190
        var newValues = [].concat(ngModel.$modelValue || []),
            values = selectize.getValue();
            
        var pushItem = function(item) {
          // We need to an array of strings and an array of objects. If we're
          // simply dealing with an array of strings then val[..] will return
          // undefined and we're just pushing undefined into items.
          if (typeof item === "object") {
            // NOTE: I couldn't get selectize.setItem() to work so I'm just 
            // accessing the array directly. Also, I'm making the assumption 
            // that both the labelField and valueField are set to the same 
            // thing here.
            //
            // TODO: Try changing this to the following:
            //
            //   selectize.items.push({
            //     text: item[selectize.settings.textField],
            //     value: item[selectize.settings.valueField]
            //   });
            //
            // That way it would respect the passed in options hash rather
            // than assuming that they're both set to the same value.
            selectize.items.push(item[selectize.settings.valueField]);
          } else {
            selectize.items.push(item);
          }
        };

        // Avoid infinite loop w/change event
        if (!angular.equals(newValues, values)) {
          newValues.forEach(function(val) { pushItem(val); });
          selectize.refreshItems();
        }
      });
    }
  };
}]);
