'use strict';

(function (app) {
  function Screen(futureData) {
    console.log("Instanciating screen", futureData);

    if (!futureData.$id) {
      angular.extend(this, futureData);
      return;
    }

    this.$unwrap(futureData);
  }

  Screen.$factory = [
    '$timeout',
    '$firebase',
    'FBURL',
    'Rectangle',
    function($timeout, $firebase, FBURL, Rectangle) {
      angular.extend(Screen, {
        $$resource: $firebase(new Firebase(FBURL + 'screens')),
        $timeout: $timeout,
        $Rectangle: Rectangle
      });

      return Screen;
    }];

  app.factory('Screen', Screen.$factory);

  Screen.$all = function() {
    var futureData = this.$$resource;
    return Screen.$unwrapCollection(futureData);
  };

  Screen.$find = function(uid) {
    return new Screen(this.$$resource.$child(uid));
  };

  Screen.$create = function(attrs) {
    var screen = new Screen(this.$$resource.$add(attrs));
    angular.extend(screen, attrs);
    return screen;
  };

  Screen.$destroy = function(uid) {
    this.$$resource.$remove(uid);
  };

  Screen.$update = function(uid, changes) {
    this.$$resource.$child(uid).$update(changes);
  };

  Screen.prototype.$createRectangle = function(rectangle) {
    // this.rectangles.$create(rectangle);
    this.$$resource.$child('rectangles').$add(rectangle);
  };

  Screen.prototype.$destroyRectangle = function(rectangles) {
    var that = this;

    angular.forEach(([].concat(rectangles) || []), function(rectangle) {
      angular.forEach(that.rectangles, function(item, uid) {
        if (item === rectangle) {
          that.$$resource.$child('rectangles').$remove(uid);
        }
      });
    });
  };

  Screen.$unwrapCollection = function(futureData) {
    var collection = {};

    futureData.$on('child_added', function(data) {
      collection[data.snapshot.name] = new Screen(data.snapshot.value);
    });

    futureData.$on('child_removed', function(data) {
      delete collection[data.snapshot.name];
    });

    futureData.$on('child_changed', function(ref) {
      angular.extend(collection[ref.snapshot.name], ref.snapshot.value);
    });

    return collection;
  };

  Screen.prototype.$unwrap = function(futureData) {
    var that = this;
    this.$$resource = futureData;

    futureData.$on('value', function(data) {
      var attrs = data.snapshot.value;

      var rectangles = Screen.$Rectangle.$unwrapCollection(attrs.rectangles);
      // rectangles.$$resource = that.$$resource.$child('rectangles');
      attrs.rectangles = rectangles;

      angular.extend(that, attrs);
    });
  };
  
}(drawingApp));
