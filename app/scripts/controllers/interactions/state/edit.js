'use strict';

(function (app) {
  var requirements = [
    '$scope',
    'StateInteractionCollection',
    'StateInteraction',
    ctrl
  ];

  function ctrl($scope, StateInteractionCollection, StateInteraction) {
    $scope.stateInteractions = $scope.screen.stateInteractions.asArray();
    $scope.screen.stateInteractions.rectangles = $scope.screen.rectangles;

    $scope.stateInteractionTriggers = StateInteraction.triggers;

    $scope.createStateInteraction = function() {
      $scope.screen.stateInteractions.create({
        actors: [$scope.inspectedShape],
        triggerVerb: $scope.stateInteractionTriggers[0],
        newStateName: _.keys($scope.inspectedShape.states)[0]
      });
    };
  }

  app.controller('StateInteractionsController', requirements);
}(drawingApp));
