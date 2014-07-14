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

