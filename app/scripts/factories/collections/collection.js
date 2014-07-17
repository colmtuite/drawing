'use strict';

(function (app) {
  function Collection() {
    this.initialize.apply(this, arguments);
  }

  Collection.$requirements = [
    '$timeout',
    'Extend',
    'ENV',
    'Model',
    function($timeout, Extend, ENV, Model) {
      angular.extend(Collection, {
        $timeout: $timeout,
        FBURL: ENV.firebaseUrl,
      });

      Collection.extend = Extend;
      angular.extend(Collection.prototype, { model: Model });

      return Collection;
    }];

  app.factory('Collection', Collection.$requirements);

  angular.extend(Collection.prototype, EventEmitter.prototype,  {
    initialize: function(options) {
      options || (options = {});
      this.collection = [];

      if (options.path) {
        this.setRef(options.path);
      }
    },

    // Ocasionally we have to manually create a reference using a path and
    // the ID of an object. It happens when using models outside of collections
    // for example.
    setRef: function(path) {
      // Strip any leading slash on the path.
      this._resource = new Firebase(Collection.FBURL + path.replace(/^\//, ''));
    },

    reset: function(reference) {
      this.empty();
      this._resource = reference;
      this._unwrap();
    },

    create: function(attrs, options) {
      options || (options = {});
      var success = options.success || this.onCreateSuccess || angular.noop;
      var failure = options.failure || this.onCreateFailure || angular.noop;
      var that = this;

      // We have to initialize a model so that we can call it's toJSON method
      // and convert the element references in the actors and triggers into
      // IDs that we can store in Firebase.
      var model = this._initializeModel(attrs);
      var modelRef = this._resource.push(model.toJSON(), function(err) {
        if (err) {
          failure.apply(that, [err]);
        } else {
          model._resource = modelRef;
          success.apply(that);
        }
      });
    },

    add: function(ref) {
      var model = this._initializeModel(ref);
      model.collection = this;
      this.collection.push(model);
      return model;
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

    // Get a model from a collection, specified by index.
    at: function(index) {
      this.collection[index];
    },

    // Remove a model from the internal collection.
    remove: function($id) {
      var model = this.get($id);
      var index = this.collection.indexOf(model);
      this.collection.splice(index, 1);
      return model;
    },

    fetch: function() {
      this.collection.forEach(function(model) { model.fetch(); });
      return this;
    },

    _initializeModel: function(args) {
      if (args.constructor.name === String(this.model)) return args;
      return new this.model(args);
    },
  });

}(drawingApp));
