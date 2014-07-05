'use strict';

(function (app) {
  function RectangleCollection() {
    this.collection = [];
  }

  RectangleCollection.$factory = [
    'Rectangle',
    function(Rectangle) {
      angular.extend(RectangleCollection, {
        $model: Rectangle
      });

      return RectangleCollection;
    }];

  app.factory('RectangleCollection', RectangleCollection.$factory);

  angular.extend(RectangleCollection.prototype, {
    asArray: function() {
      return this.collection;
    },

    reset: function(data) {
      console.log("Resetting rectangles", data);
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

    add: function(model) {
      model = RectangleCollection._initializeModel(model);
      this.collection.push(model);
      return model;
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
