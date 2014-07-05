'use strict';

(function (app) {
  function ScreenCollection() {
    this.collection = [];
  }

  ScreenCollection.$factory = [
    '$firebase',
    'FBURL',
    'Screen',
    function($firebase, FBURL, Screen) {
      angular.extend(ScreenCollection, {
        FBURL: FBURL,
        $firebase: $firebase,
        resource: $firebase(new Firebase(FBURL + 'screens')),
        $model: Screen,
      });

      return ScreenCollection;
    }];

  app.factory('ScreenCollection', ScreenCollection.$factory);

  angular.extend(ScreenCollection.prototype, {
    fetch: function() {
      this.collection.forEach(function(model) {
        model.fetch();
      });
      return this;
    },

    reset: function(ids) {
      var that = this;

      this.empty();
      _.map(([].concat(ids) || []), function(id) {
        that.add({ '$id': id });
      });
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

    // TODO: Optimistially add the model to the collection.
    create: function(attrs, success) {
      success || (success = angular.noop());
      var that = this;
      // Be sure to return the promise so we can chain more actions onto it.
      return this.resource().asArray()
        .add(attrs).then(function(data) {
          angular.extend(attrs, { '$id': data.name() });
          var model = that.add(attrs);
          success(model);
        });
    },

    get: function(id) {
      return _.find(this.collection, { '$id': id });
    },

    // This method is named to mimic the AngularFire API.
    asArray: function() {
      return this.collection;
    },

    resource: function(path) {
      var ref;

      if (path) {
        ref = new Firebase(ScreenCollection.FBURL + 'screens/' + path);
        return ScreenCollection.$firebase(ref);
      } else if (!this._resource) {
        ref = new Firebase(ScreenCollection.FBURL + 'screens');
        this._resource = ScreenCollection.$firebase(ref);
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

  // Remove a screen from the internal collection.
  ScreenCollection.prototype.remove = function(model) {
    var index = this.collection.indexOf(model);
    this.collection.splice(index, 1);
    return model;
  };

})(drawingApp);
