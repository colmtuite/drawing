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
    create: function(attrs, success) {
      success || (success = angular.noop);
      var model = RectangleCollection._initializeModel(attrs);
      this._resource.push(model.toJSON());
      success();
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
}(drawingApp));
