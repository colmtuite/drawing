'use strict';

(function (app) {
  function ScreenCollection() {}

  ScreenCollection.$factory = [
    '$timeout',
    '$firebase',
    'FBURL',
    'Screen',
    function($timeout, $firebase, FBURL, Screen) {
      angular.extend(ScreenCollection, {
        // This is a base level collection so it needs a direct resource
        // reference.
        $$resource: $firebase(new Firebase(FBURL + 'screens')),
        $timeout: $timeout,
        $Screen: Screen
      });

      return ScreenCollection;
    }];

  app.factory('ScreenCollection', ScreenCollection.$factory);

  ScreenCollection.prototype.$all = function() {
    var futureData = ScreenCollection.$$resource;
    return this.$unwrapCollection(futureData);
  };

  ScreenCollection.prototype.$find = function(uid) {
    var ref = ScreenCollection.$$resource.$child(uid)
    return new ScreenCollection.$Screen(ref);
  };

  ScreenCollection.prototype.$create = function(attrs) {
    var ref = ScreenCollection.$$resource.$add(attrs)
    var screen = new ScreenCollection.$Screen(ref);
    angular.extend(screen, attrs);
    return screen;
  };

  ScreenCollection.prototype.$unwrapCollection = function(futureData) {
    var collection = {};

    futureData.$on('child_added', function(data) {
      var uid = data.snapshot.name, value = data.snapshot.value;
      var screen = new ScreenCollection.$Screen(value);
      screen.$$resource = ScreenCollection.$$resource.$child(uid);
      collection[uid] = screen;
    });

    futureData.$on('child_removed', function(data) {
      delete collection[data.snapshot.name];
    });

    futureData.$on('child_changed', function(ref) {
      angular.extend(collection[ref.snapshot.name], ref.snapshot.value);
    });

    return collection;
  };
})(drawingApp);
