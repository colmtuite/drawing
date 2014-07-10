'use strict';

(function (app) {
  var RectangleCollection;

  var $factory = [
    'Rectangle',
    'Collection',
    function(Rectangle, Collection) {
      RectangleCollection = Collection.extend(methods, angular.extend({
        $model: Rectangle,
      }, classMethods));

      return RectangleCollection;
    }];

  app.factory('RectangleCollection', $factory);

  var methods = {
    url: function() {
      return 'screens/' + this.$screenId + '/rectangles';
    },

    reset: function(reference) {
      this.empty();
      this._resource = reference;
      this._unwrap();
    },

    // TODO: Optimistially add the model to the collection.
    create: function(attrs, success) {
      success || (success = angular.noop);
      // var that = this;
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
      var that = this;

      this.resource().on('child_added', function(newSnap, prevSiblingName) {
        RectangleCollection.$timeout(function() {
          that.add(that.resource().child(newSnap.name()));
        });
      }, this);

      this.resource().on('child_removed', function(snap) {
        // console.log("Rect removed", snap.name(), snap.val());
        RectangleCollection.$timeout(function() {
          that.remove(snap.name());
        });
      }, this);
    },
  };

  var classMethods = {
    _initializeModel: function(args) {
      if (args.constructor.name === "Rectangle") return args;
      return new this.$model(args);
    }
  };

  // RectangleCollection.prototype._keyOfValue = function(value) {
  //   return _.chain(this.collection).map(function(item, key) {
  //     if (item === value) return key;
  //   }).compact().value()[0];
  // };
}(drawingApp));
