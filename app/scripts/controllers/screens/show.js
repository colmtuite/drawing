'use strict';

// (function(app) {
//   app.controller('ScreensShowController', 
//     ['$scope', '$routeParams', 'RectFactory', 'Screen', 
//      'InteractionsFactory', 'GroupsFactory', ctrl]);
// 
//   function ctrl($scope, $routeParams, RectFactory, Screen, InteractionsFactory, GroupsFactory) {
//     Screen.find($routeParams.slug).then(function(resp) {
//       $scope.screen = resp.screen;
//       $scope.rectangles = RectFactory.all();
//       $scope.interactions = InteractionsFactory.all();
//       $scope.stateInteractions = InteractionsFactory.all('stateInteractions');
//       $scope.groups = GroupsFactory.all();
//     });
//   }
// })(drawingApp);
