'use strict';

(function (app) {
  var StateInteraction;

  var $factory = [
    'Model',
    function(Model) {
      StateInteraction = Model.extend(methods, angular.extend({
      }, classMethods));

      return StateInteraction;
    }];

  app.factory('StateInteraction', $factory);

  var methods = {
  };

  var classMethods = {

  };

})(drawingApp);
