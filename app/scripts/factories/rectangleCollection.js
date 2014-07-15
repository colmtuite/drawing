'use strict';

(function (app) {
  var $requirements = [
    'Rectangle',
    'Collection',
    function(Rectangle, Collection) {
      angular.extend(methods, { model: Rectangle });
      return Collection.extend(methods, classMethods);
    }];

  app.factory('RectangleCollection', $requirements);

  var methods = {
    deselectAll: function() {
      angular.forEach(this.collection, function(item) { item.deselect(); });
    },

    unhighlightAll: function() {
      this.collection.forEach(function(item) { item.unhighlight(); });
    },
  };

  var classMethods = {};
}(drawingApp));
