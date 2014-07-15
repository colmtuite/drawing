'use strict';

(function (app) {
  var $requirements = [
    'Collection',
    'Interaction',
    function(Collection, Interaction) {
      angular.extend(methods, { model: Interaction });
      return Collection.extend(methods, classMethods);
    }];

  app.factory('InteractionCollection', $requirements);

  var methods = {};
  var classMethods = {};
}(drawingApp));
