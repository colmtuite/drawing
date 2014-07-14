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
    // TODO: Optimistially add the model to the collection.
    create: function(attrs, success) {
      success || (success = angular.noop);
      // var that = this;
      // Be sure to return the promise so we can chain more actions onto it.
      var newModel = this._resource.push(attrs)
      // angular.extend(attrs, { '$id': newModel.name() });
      // var model = that.add(attrs);
      // success(model);
    },

    add: function(ref) {
      var model = RectangleCollection._initializeModel(ref);
      model.collection = this;
      this.collection.push(model);
      return model;
    },

    deselectAll: function() {
      angular.forEach(this.collection, function(item) { item.deselect(); });
    },

    unhighlightAll: function() {
      this.collection.forEach(function(item) { item.unhighlight(); });
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
