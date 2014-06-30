'use strict';

(function (app) {
  // This is a nested resource so we pass the future data into it and
  // assign it.
  function RectangleCollection(futureData) {
    this.$$resource = futureData;
  }

  RectangleCollection.$factory = [
    'Rectangle',
    function(Rectangle) {
      angular.extend(RectangleCollection, {
        $Rectangle: Rectangle
      });

      return RectangleCollection;
    }];

  app.factory('RectangleCollection', RectangleCollection.$factory);

  RectangleCollection.prototype.$all = function() {
    return this.$unwrapCollection();
  };

  RectangleCollection.prototype.$create = function(attrs) {
    var rect = RectangleCollection.$Rectangle.$new(attrs);
    this.$$resource.$add(rect);
  };

  RectangleCollection.prototype.deselectAll = function() {
    angular.forEach(this.collection, function(item, key) {
      item.deselect();
    });
  };

  RectangleCollection.prototype.$unwrapCollection = function() {
    this.collection = {};
    var that = this;

    this.$$resource.$on('child_added', function(data) {
      var uid = data.snapshot.name, value = data.snapshot.value;
      var ref = that.$$resource.$child(uid);
      var rectangle = new RectangleCollection.$Rectangle(ref);
      angular.extend(rectangle, value);
      that.collection[uid] = rectangle;
    });

    this.$$resource.$on('child_removed', function(data) {
      delete that.collection[data.snapshot.name];
    });

    this.$$resource.$on('child_changed', function(ref) {
      angular.extend(that.collection[ref.snapshot.name], ref.snapshot.value);
    });

    return this.collection;
  };

  RectangleCollection.prototype._keyOfValue = function(value) {
    return _.chain(this.collection).map(function(item, key) {
      if (item === value) return key;
    }).compact().value()[0];
  };
}(drawingApp));
