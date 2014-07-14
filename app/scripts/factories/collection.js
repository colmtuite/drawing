'use strict';

(function (app) {
  function Collection() {
    this.initialize.apply(this, arguments);
  }

  Collection.$factory = [
    '$timeout',
    'Extend',
    'ENV',
    function($timeout, Extend, ENV) {
      angular.extend(Collection, {
        $timeout: $timeout,
        FBURL: ENV.firebaseUrl,
      });

      Collection.extend = Extend;

      return Collection;
    }];

  app.factory('Collection', Collection.$factory);

  angular.extend(Collection.prototype, EventEmitter.prototype,  {
    initialize: function() {
      this.collection = [];
    },

    reset: function(reference) {
      this.empty();
      this._resource = reference;
      this._unwrap();
    },

    _unwrap: function() {
      var that = this;

      this._resource.once('value', function(snap) {
        this.trigger('load');
      }, this);

      this._resource.on('child_added', function(newSnap, prevSiblingName) {
        Collection.$timeout(function() {
          var model = that.add(that._resource.child(newSnap.name()));
          // NOTE: The emitted data MUST be an array.
          that.trigger('child_added', [model]);
        });
      }, this);

      this._resource.on('child_removed', function(snap) {
        Collection.$timeout(function() {
          var model = that.remove(snap.name());
          that.trigger('child_removed', [model]);
        });
      }, this);
    },

    // If we just set this.collection to a new array literal then any bindings
    // which angular has attached will be lost. Instead, we have empty it.
    empty: function() {
      this.collection.length = 0;
    },

    asArray: function() {
      return this.collection;
    },

    get: function(id) {
      return _.findWhere(this.collection, { '$id': id });
    },

    where: function(conditions) {
      return _.where(this.collection, conditions);
    },

    // Remove a model from the internal collection.
    remove: function(model) {
      var index = this.collection.indexOf(model);
      this.collection.splice(index, 1);
      return model;
    },

  });

}(drawingApp));
