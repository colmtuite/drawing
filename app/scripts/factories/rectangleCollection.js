'use strict';

(function (app) {
  function RectangleCollection(futureData) {
    var that = this;
    this.collection = {};
    this.$$resource = futureData;

    futureData.$on('child_added', function(data) {
      var attrs = data.snapshot.value;
      that.collection[data.snapshot.name] = new RectangleCollection.$Rectangle(attrs);
    });

    futureData.$on('child_removed', function(data) {
      delete that.collection[data.snapshot.name];
    });
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

  RectangleCollection.prototype.$create = function(attrs) {
    this.$$resource.$add(RectangleCollection.$Rectangle.$new(attrs));
  };
  
  RectangleCollection.prototype.$destroy = function(rectangles) {
    var that = this;

    angular.forEach(([].concat(rectangles) || []), function(rectangle) {
      var uid = that._keyOfValue(rectangle);
      that.$$resource.$remove(uid);
    });
  };

  RectangleCollection.prototype._keyOfValue = function(value) {
    return _.chain(this.collection).map(function(item, key) {
      if (item === value) return key;
    }).compact().value()[0];
  };


  // This is here so that numerous controllers can keep track of which is
  // the currently inspected shape.
  RectangleCollection.inspectedShape = function(rectangle) {
    if (typeof rectangle !== "undefined") {
      this._inspectedShape = rectangle;
    }
    // NOTE: It's very important that this returns a reference to data
    // when used as both a setter and getter. Otherwise, we can't set up
    // watchers on the data.
    return this._inspectedShape;
  };

  RectangleCollection.clearInspectedShape = function() {
    delete this._inspectedShape;
  };

}(drawingApp));
