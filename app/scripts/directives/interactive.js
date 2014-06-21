'use strict';

drawingApp.directive('drInteractive', ['$timeout', '$compile', 
  function($timeout, $compile) {
    return {
      scope: {
        interactions: '='
      },
      link: function(scope, element, attrs) {
        // INFO: http://stackoverflow.com/a/12243086/574190
        $timeout(function() {
          scope.interactions.forEach(function(interaction) {
            // The problem here is that groups respond to #elements and lone
            // shapes don't.
            if (typeof interaction.actor.elements !== "undefined") {
              // TODO: Pluck name, join with ', #' then prefix '#'
              var names = interaction.actor.elements.map(function(shape) {
                return '#' + shape.name;
              }).join(', ');
              var actorElement = element.children(names);
            } else {
              var actorElement = element.children('#' + interaction.actor.name);
            }

            var names = interaction.actees.map(function(shape) {
              return '#' + shape.name;
            }).join(', ');
            var acteeElements = element.children(names);
            
            actorElement.on(interaction.trigger.name, function() {
              acteeElements[interaction.action.name]();
            });
          });
        });
      }
    };
}]);
