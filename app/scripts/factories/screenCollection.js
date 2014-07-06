'use strict';

(function (app) {
  function ScreenCollection() {
    this.collection = [];
  }

  ScreenCollection.$factory = [
    'FBURL',
    'Screen',
    function(FBURL, Screen) {
      angular.extend(ScreenCollection, {
        FBURL: FBURL,
        $model: Screen,
      });

      return ScreenCollection;
    }];

  app.factory('ScreenCollection', ScreenCollection.$factory);

  angular.extend(ScreenCollection.prototype, EventEmitter.prototype, {
    fetch: function() {
      this.collection.forEach(function(model) { model.fetch(); });
      return this;
    },

    reset: function(ids) {
      var that = this;
      this.empty();
      _.map(([].concat(ids) || []), function(id) {
        that.add({ '$id': id });
      });
      this.trigger('reset');
    },

    // If we just set this.collection to a new array literal then any bindings
    // which angular has attached will be lost. Instead, we have empty it.
    empty: function() {
      this.collection.length = 0;
    },

    // Add a screen to the internal collection.
    add: function(model) {
      model = ScreenCollection._initializeModel(model);
      this.collection.push(model);
      return model;
    },

    // Remove a screen from the internal collection.
    remove: function(model) {
      var index = this.collection.indexOf(model);
      this.collection.splice(index, 1);
      return model;
    },

    // TODO: Optimistially add the model to the collection.
    create: function(attrs, success) {
      success || (success = angular.noop);
      var that = this;
      var newModel = this.resource().push(attrs);
      angular.extend(attrs, { '$id': newModel.name() });
      var model = that.add(attrs);
      success(attrs);
    },

    get: function(id) {
      return _.find(this.collection, { '$id': id });
    },

    // This method is named to mimic the AngularFire API.
    asArray: function() {
      return this.collection;
    },

    resource: function(path) {
      var ref,
          basePath = ScreenCollection.FBURL + 'screens';

      if (path) {
        return new Firebase(basePath + '/' + path);
      } else if (!this._resource) {
        this._resource = new Firebase(basePath);
      }

      return this._resource;
    },
  });


  ScreenCollection._initializeModel = function(args) {
    // We may be already dealing with a Screen instance. If we are, we need
    // go no further.
    if (args.constructor.name === "Screen") return args;
    return new this.$model(args);
  };

})(drawingApp);
