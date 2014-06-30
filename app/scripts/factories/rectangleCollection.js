'use strict';

(function (app) {
  // This is a nested resource so we pass the future data into it and
  // assign it.
  function RectangleCollection(futureData) {
    console.log("Instanciating RectangleCollection", futureData);
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
    this.$$resource.$add(ref);
  };
  
  // RectangleCollection.prototype.$destroy = function(rectangles) {
  //   var that = this;

  //   angular.forEach(([].concat(rectangles) || []), function(rectangle) {
  //     var uid = that._keyOfValue(rectangle);
  //     that.$$resource.$remove(uid);
  //   });
  // };

  RectangleCollection.prototype.$unwrapCollection = function() {
    var collection = {};
    var that = this;

    this.$$resource.$on('child_added', function(data) {
      var uid = data.snapshot.name, value = data.snapshot.value;
      var ref = that.$$resource.$child(uid);
      var rectangle = new RectangleCollection.$Rectangle(ref);
      angular.extend(rectangle, value);
      collection[uid] = rectangle;
    });

    this.$$resource.$on('child_removed', function(data) {
      delete collection[data.snapshot.name];
    });

    this.$$resource.$on('child_changed', function(ref) {
      angular.extend(collection[ref.snapshot.name], ref.snapshot.value);
    });

    return collection;
  };

  RectangleCollection.prototype._keyOfValue = function(value) {
    return _.chain(this.collection).map(function(item, key) {
      if (item === value) return key;
    }).compact().value()[0];
  };

  // TODO: There has to be a better place to put this stuff? Why not just make
  // an InspectedRectangle service and add a ::set() method to it?

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
