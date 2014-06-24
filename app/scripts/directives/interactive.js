'use strict';

(function(app) {
  // type should be one of 'actor' or 'actee'.
  var findElements = function(interaction, type) {
    if (typeof interaction[type].elements !== "undefined") {
      // TODO: Pluck name, join with ', #' then prefix '#'
      var names = interaction[type].elements.map(function(shape) {
        return '#' + shape.name;
      }).join(', ');
      return element.children(names);
    } else {
      return element.children('#' + interaction[type].name);
      }
    }

  drawingApp.directive('drInteractive', ['$timeout', '$compile', 
    function($timeout, $compile) {
      return {
        scope: {
          interactions: '=',
          stateInteractions: '='
        },
        link: function(scope, element, attrs) {
          // INFO: http://stackoverflow.com/a/12243086/574190
          $timeout(function() {
            scope.interactions.forEach(function(interaction) {
              var actorElement, names, acteeElements;

              // Each interaction can only have one actor element (rather
              // than an array of elements or groups like the actees). Thus, we
              // don't have to iteracte over it.
              actorElement = element.children(interaction.actor.elementIds());

              // actees is an array of shape objects. These shape objects can
              // either be individual shapes or can be groups of shapes.
              names = interaction.actees.map(function(actee) {
                return actee.elementIds();
              }).join(', ');

              acteeElements = element.children(names);

              actorElement.on(interaction.trigger.name, function() {
                acteeElements[interaction.action.name]();
              });
            });

            scope.stateInteractions.forEach(function(interaction) {
              var actorElement = element.children(interaction.actor.elementIds());
              var name = interaction.newState.name;
              var newStyles = interaction.actor.previewStyle(name);
              actorElement.on(interaction.trigger.name, function() {
                actorElement.css(newStyles);
              });
            });
          });
        }
      };
  }]);
})(drawingApp);
