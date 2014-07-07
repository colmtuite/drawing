'use strict';

(function (app) {
  function RectangleCollection() {
    this.collection = [];
  }

  RectangleCollection.$factory = [
    'Rectangle',
    'Collection',
    function(Rectangle, Collection) {
      angular.extend(RectangleCollection, {
        $model: Rectangle
      });

      angular.extend(RectangleCollection.prototype, Collection.prototype);

      return RectangleCollection;
    }];

  app.factory('RectangleCollection', RectangleCollection.$factory);

  angular.extend(RectangleCollection.prototype, {
    url: function() {
      return 'screens/' + this.$screenId + '/rectangles';
    },

    reset: function(reference) {
      this.empty();
      this._resource = reference;
      this._unwrap();

      // The _.compact prevents us from iterating over an array full
      // of undefined values.
      // _.map(_.compact(([].concat(models) || [])), function(model) {
      //   that.add(model);
      // });
    },

    // TODO: Optimistially add the model to the collection.
    create: function(attrs, success) {
      success || (success = angular.noop);
      var that = this;
      // Be sure to return the promise so we can chain more actions onto it.
      var newModel = this.resource().push(attrs)
      // angular.extend(attrs, { '$id': newModel.name() });
      // var model = that.add(attrs);
      // success(model);
    },

    add: function(model) {
      model = RectangleCollection._initializeModel(model);
      this.collection.push(model);
      return model;
    },

    deselectAll: function() {
      angular.forEach(this.collection, function(item) {
        item.deselect();
      });
    },

    _unwrap: function() {
      // console.log("Unwrapping rects", this.$screenId);

      this.resource().on('child_added', function(newSnap, prevSiblingName) {
        this.add(this.resource().child(newSnap.name()));
      }, this);

      this.resource().on('child_removed', function(snap) {
        this.remove(snap.name());
      }, this);
    },
  });

  RectangleCollection._initializeModel = function(args) {
    if (args.constructor.name === "Rectangle") return args;
    return new this.$model(args);
  };


  RectangleCollection.prototype._keyOfValue = function(value) {
    return _.chain(this.collection).map(function(item, key) {
      if (item === value) return key;
    }).compact().value()[0];
  };
}(drawingApp));
