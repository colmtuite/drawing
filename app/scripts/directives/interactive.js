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
            var actorElement = element.children('#' + interaction.actor.name),
                acteeElement = element.children('#' + interaction.actee.name);

            actorElement.on(interaction.trigger.name, function() {
              acteeElement[interaction.action.name]();
            });
          });
        });
      }
    };
}]);
