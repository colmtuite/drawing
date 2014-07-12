'use strict';

(function (app) {
  var InteractionCollection;

  var $factory = [
    'Collection',
    'Interaction',
    function(Collection, Interaction) {
      InteractionCollection = Collection.extend(methods, angular.extend({
        $model: Interaction
      }, classMethods));

      return InteractionCollection;
    }];

  app.factory('InteractionCollection', $factory);

  var methods = {
    reset: function(reference) {
      this.empty();
      this._resource = reference;
      this._unwrap();
    },

    create: function(attrs, success) {
      success || (success = angular.noop);
      // We have to initialize a model so that we can call it's toJSON method
      // and convert the element references in the actors and triggers into
      // IDs that we can store in Firebase.
      var model = InteractionCollection._initializeModel(attrs);
      this._resource.push(model.toJSON());
    },

    add: function(ref) {
      var model = InteractionCollection._initializeModel(ref);
      model.collection = this;
      this.collection.push(model);
      return model;
    },

    _unwrap: function() {
      var that = this;

      this._resource.on('child_added', function(newSnap, prevSiblingName) {
        InteractionCollection.$timeout(function() {
          that.add(that._resource.child(newSnap.name()));
        });
      }, this);

      this._resource.on('child_removed', function(snap) {
        InteractionCollection.$timeout(function() {
          that.remove(snap.name());
        });
      }, this);
    },
  };

  var classMethods = {
    _initializeModel: function(args) {
      if (args.constructor.name === "Interaction") return args;
      return new this.$model(args);
    }
  };
}(drawingApp));
