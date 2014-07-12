'use strict';

(function (app) {

  var requirements = [
    '$scope', 
    '$filter', 
    ctrl
  ];

  function ctrl($scope, $filter) {
//     // TODO: Rename to elementInteractions to represent the fact that these are
//     // interactions between elements.
//     $scope.interactions = InteractionsFactory.all();
//     // TODO: Rename to elementInteractionActions.
//     $scope.interactionActions = InteractionsFactory.actions();
//     // This name is ok since these triggers are used on state and element
//     // interactions.
//     $scope.interactionTriggers = InteractionsFactory.triggers();
// 
//     $scope.inspectedShape = RectFactory.inspectedShape();
//     $scope.$watch(function() { return RectFactory.inspectedShape(); },
//       function(newVal, oldVal) {
//         $scope.inspectedShape = newVal;
//     });
// 
//     $scope.interactionElements = function() {
//       return $scope.rectangles.concat($scope.groups);
//     };
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
