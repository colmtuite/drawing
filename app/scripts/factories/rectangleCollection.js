'use strict';

(function (app) {
  function RectangleCollection() {
    this.collection = [];
  }

  RectangleCollection.$factory = [
    'Rectangle',
    'FBURL',
    '$firebase',
    function(Rectangle, FBURL, $firebase) {
      angular.extend(RectangleCollection, {
        $model: Rectangle,
        FBURL: FBURL,
        $firebase: $firebase
      });

      return RectangleCollection;
    }];

  app.factory('RectangleCollection', RectangleCollection.$factory);

  angular.extend(RectangleCollection.prototype, {
    asArray: function() {
      return this.collection;
    },

    reset: function(models) {
      console.log("resetting rectangles", models);
      var that = this;
      // The _.compact prevents us from iterating over an array full
      // of undefined values.
      _.map(_.compact(([].concat(models) || [])), function(model) {
        that.add(model);
      });
    },

    // TODO: Optimistially add the model to the collection.
    create: function(attrs, success) {
      success || (success = angular.noop);
      var that = this;
      // Be sure to return the promise so we can chain more actions onto it.
      return this.resource().asArray()
        .add(attrs).then(function(data) {
          angular.extend(attrs, { '$id': data.name() });
          var model = that.add(attrs);
          success(model);
        });
    },

    add: function(model) {
      model = RectangleCollection._initializeModel(model);
      angular.extend(model, { '$screenId': this.$screenId });
      this.collection.push(model);
      return model;
    },

    resource: function(path) {
      var ref,
          // TODO: This is getting a bit rediculous here. I think I need to
          // start passing in something like "parentPath" rather than the
          // screen id.
          basePath = RectangleCollection.FBURL + 'screens/' + this.$screenId + '/rectangles';

      if (path) {
        ref = new Firebase(basePath + '/' + path);
        return RectangleCollection.$firebase(ref);
      } else if (!this._resource) {
        ref = new Firebase(basePath);
        this._resource = RectangleCollection.$firebase(ref);
      }

      return this._resource;
    },
  });

  RectangleCollection._initializeModel = function(args) {
    // We may be already dealing with a Rectangle instance. If we are, we need
    // go no further.
    if (args.constructor.name === "Rectangle") return args;
    return new this.$model(args);
  };

  // RectangleCollection.prototype.deselectAll = function() {
  //   angular.forEach(this.collection, function(item, key) {
  //     item.deselect();
  //   });
  // };

  RectangleCollection.prototype._keyOfValue = function(value) {
    return _.chain(this.collection).map(function(item, key) {
      if (item === value) return key;
    }).compact().value()[0];
  };
}(drawingApp));
