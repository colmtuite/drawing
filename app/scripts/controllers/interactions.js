'use strict';

(function (app) {

  var requirements = [
    '$scope', 
    'Interaction', 
    'InspectedRectangle',
    ctrl
  ];

  function ctrl($scope, Interaction, InspectedRectangle) {
    $scope.interactions = $scope.screen.interactions.asArray();
    $scope.screen.interactions.rectangles = $scope.screen.rectangles;

    $scope.interactionActions = Interaction.actions;
    $scope.interactionTriggers = Interaction.triggers;
    $scope.interactionElements = $scope.rectangles;

    $scope.inspectedShape = InspectedRectangle.inspected();
    $scope.$watch(function() { return InspectedRectangle.inspected(); },
      function(newVal, oldVal) {
        $scope.inspectedShape = newVal;
    });

    $scope.createInteraction = function() {
      var attrs = Interaction.initialAttributes({
        triggers: [$scope.inspectedShape]
      });
      $scope.screen.interactions.create(attrs);
    };

    $scope.highlightElement = function(name) {
      $scope.unhighlightAll();
      var elements = $scope.screen.rectangles.where({ name: name })
      elements.forEach(function(rect) {
        rect.highlight();
      });
    };

    $scope.unhighlightAll = function() {
      $scope.screen.rectangles.unhighlightAll();
    };

  }

  app.controller('ElementInteractionsController', requirements);
  
}(drawingApp));

(function (app) {
  var requirements = [
    ctrl
  ];

  function ctrl() {
//     $scope.stateInteractions = InteractionsFactory.all('stateInteractions');
//     $scope.interactionTriggers = InteractionsFactory.triggers();
// 
//     $scope.inspectedShape = RectFactory.inspectedShape();
//     $scope.$watch(function() { return RectFactory.inspectedShape(); },
//       function(newVal, oldVal) {
//         $scope.inspectedShape = newVal;
//     });
// 
//     $scope.createStateInteraction = function() {
//       InteractionsFactory.createState({
//         actor: $scope.inspectedShape,
//         trigger: $scope.interactionTriggers[0],
//         newState: $scope.inspectedShape.states[1]
//       });
//     };
// 
//     $scope.deleteStateInteraction = function(interaction) {
//       InteractionsFactory.destroyState(interaction);
//     };
  }

  app.controller('StateInteractionsController', requirements);
}(drawingApp));
