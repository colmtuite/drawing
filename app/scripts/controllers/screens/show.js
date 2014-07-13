'use strict';

(function(app) {
  app.controller('ScreensShowController', 
    ['$scope', '$stateParams', 'Screen', ctrl]);

  function ctrl($scope, $stateParams, Screen) {
    $scope.screen = new Screen({ path: 'screens/' + $stateParams.id });
    $scope.screen.fetch();

    $scope.rectangles = $scope.screen.rectangles.asArray();
    $scope.interactions = $scope.screen.interactions;
    $scope.screen.interactions.rectangles = $scope.screen.rectangles;
  }
})(drawingApp);
