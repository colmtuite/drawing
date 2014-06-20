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

            console.log("Preview", interaction);
            console.log("Actor names", names, actorElement[0]);

            // Problem here is that angularSelectize sets actees to a
            // comma-delimited string of names rather than an array of
            // objects like I'm expecting here.
            var names = interaction.actees.map(function(shape) {
              return '#' + shape.name;
            }).join(', ');
            var acteeElements = element.children(names);
            console.log("Actee names", names, acteeElements[0]);

            
            actorElement.on(interaction.trigger.name, function() {
              console.log("Clicked");
              acteeElements[interaction.action.name]();
            });
          });
        });
      }
    };
}]);
