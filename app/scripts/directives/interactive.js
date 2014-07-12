'use strict';

(function(app) {
  drawingApp.directive('drInteractive', ['$timeout', '$compile', 
    function($timeout, $compile) {
      return {
        scope: {
          interactions: '=',
          stateInteractions: '='
        },
        link: function(scope, element, attrs) {
          scope.interactions.on('child_added', function(interaction) {
            var triggerElement, names, actorElements, triggerIds;

            // INFO: http://stackoverflow.com/a/12243086/574190
            $timeout(function() {

              // TODO: The triggers don't appear to exist in time for me to
              // access them if I move this code out of the $timeout function.
              // That makes me suspicious that I'm just getting lucky that
              // the've been loaded when I try to access them here rather than
              // the event listening actually working. Needs investigation.
              triggerIds = interaction.triggers[0].elementIds();
              triggerElement = element.children(triggerIds);

              names = interaction.actors.map(function(actor) {
                return actor.elementIds();
              }).join(', ');

              actorElements = element.children(names);

              triggerElement.on(interaction.triggerVerb.name, function() {
                actorElements[interaction.actionVerb.name]();
              });
            });
          });

            // scope.stateInteractions.forEach(function(interaction) {
            //   var actorElement = element.children(interaction.actor.elementIds());
            //   var name = interaction.newState.name;
            //   var newStyles = interaction.actor.previewStyle(name);
            //   actorElement.on(interaction.trigger.name, function() {
            //     actorElement.css(newStyles);
            //   });
            // });
        }
      };
  }]);
})(drawingApp);
