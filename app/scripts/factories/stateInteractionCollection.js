
'use strict';

(function (app) {
  var $requirements = [
    'Collection',
    'StateInteraction',
    function(Collection, StateInteraction) {
      angular.extend(methods, { model: StateInteraction });
      return Collection.extend(methods, classMethods);
    }];

  app.factory('StateInteractionCollection', $requirements);

  var methods = {};
  var classMethods = {};
})(drawingApp);
