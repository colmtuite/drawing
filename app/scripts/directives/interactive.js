'use strict';

(function(app) {
  drawingApp.directive('drInteractive', ['$timeout', '$compile', 
    function($timeout, $compile) {
      return {
        scope: true,
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

          scope.stateInteractions.on('child_added', function(interaction) {
            var actorElement, actorIds, name, newStyles;

            $timeout(function() {
              actorIds = interaction.actors[0].elementIds();
              actorElement = element.children(actorIds);
              name = interaction.newStateName;
              newStyles = interaction.actors[0].previewStyle(name);
              actorElement.on(interaction.triggerVerb.name, function() {
                actorElement.css(newStyles);
              });
            });
          });

          // TODO: Remove the listeners when the 'child_removed' event is
          // fired.

        }
      };
  }]);
})(drawingApp);
