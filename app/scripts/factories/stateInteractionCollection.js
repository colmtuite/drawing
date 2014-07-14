
'use strict';

(function (app) {
  var StateInteractionCollection;

  var $factory = [
    'Collection',
    'StateInteraction',
    function(Collection, StateInteraction) {
      StateInteractionCollection = Collection.extend(methods, angular.extend({
        $model: StateInteraction
      }, classMethods));

      return StateInteractionCollection;
    }];

  app.factory('StateInteractionCollection', $factory);

  var methods = {
    add: function(ref) {
      var model = StateInteractionCollection._initializeModel(ref);
      model.collection = this;
      this.collection.push(model);
      return model;
    },

    create: function(attrs, success) {
      success || (success = angular.noop);
      var model = StateInteractionCollection._initializeModel(attrs);
      this._resource.push(model.toJSON());
    },
  };

  var classMethods = {
    _initializeModel: function(args) {
      if (args.constructor.name === "StateInteraction") return args;
      return new this.$model(args);
    },
  };
})(drawingApp);
