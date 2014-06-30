'use strict';

(function (app) {
  function Screen(futureData) {
    if (!futureData.$id) {
      angular.extend(this, futureData);
      return;
    }

    this.$unwrap(futureData);
  }

  Screen.$factory = [
    '$timeout',
    'RectangleCollection',
    function($timeout, RectangleCollection) {
      angular.extend(Screen, {
        $timeout: $timeout,
        $RectangleCollection: RectangleCollection
      });

      return Screen;
    }];

  app.factory('Screen', Screen.$factory);

  Screen.prototype.$destroy = function() {
    this.$$resource.$remove();
  };

  Screen.prototype.$update = function(attrs) {
    this.$$resource.$update(attrs);
  };

  Screen.prototype.$save = function() {
    this.$$resource.$save();
  };

  Screen.prototype.$unwrap = function(futureData) {
    var that = this;
    this.$$resource = futureData;
    var ref = this.$$resource.$child('rectangles');
    // Instanciate this even before the data is loaded so that we can call
    // methods on it in the controller without having to wait.
    this.rectangles = new Screen.$RectangleCollection(ref);

    this.$$resource.$on('loaded', function(data) {
      // Delete data.rectangles so we don't overwrite the association we set
      // up just above.
      delete data.rectangles;
      angular.extend(that, data);
    });
  };
  
}(drawingApp));
