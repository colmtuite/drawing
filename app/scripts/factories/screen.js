'use strict';

(function (app) {
  function Screen(futureData) {
    // Instanciate this even before the data is loaded so that we can call
    // methods on it in the controller without having to wait.
    this.rectangles = new Screen.$RectangleCollection();

    console.log("Instanciating Screen", futureData, this);

    if (!futureData.$id) {
      angular.extend(this, futureData);
      this.$load();
    }
  }

  Screen.$factory = [
    'RectangleCollection',
    '$firebase',
    'FBURL',
    function(RectangleCollection, $firebase, FBURL) {
      angular.extend(Screen, {
        $RectangleCollection: RectangleCollection,
        $firebase: $firebase,
        FBURL: FBURL
      });

      return Screen;
    }];

  app.factory('Screen', Screen.$factory);

  Screen.prototype.$destroy = function() {
    Screen.$firebase(this.path()).$remove();
  };

  Screen.prototype.$update = function(attrs) {
    Screen.$firebase(this.path()).$update(attrs);
  };

  Screen.prototype.setUid = function(uid) {
    this.uid = uid;
    // The uid has changed so we want to reload everything.
    this.$load();
  };

  Screen.prototype.$load = function() {
    var path = this.path();
    if (!path) return;
    return this.$unwrap(Screen.$firebase(path));
  };

  Screen.prototype.path = function() {
    if (!this.uid) return;

    // Only create the path once. It won't change since the uid won't.
    if (!this.$$path) {
      this.$$path = new Firebase(Screen.FBURL + 'screens/' + this.uid);
    }

    return this.$$path;
  };

  Screen.prototype.$unwrap = function(futureData) {
    var that = this;

    futureData
      .$on('loaded', function(data) {
        console.log("Loaded the screen data", data);
        // Loading the screen will also load all it's nested data. That means
        // that all rectangle data is available at this point. We need to
        // shove it into the collection.
        // that.rectangles.$reset(data.rectangeles);
        // Now we need to delete it before we overwrite the collection we just
        // populated.
        delete data.rectangles;
        angular.extend(that, data);
        that._fetchAssociatedObjects();
      });
  };

  Screen.prototype._fetchAssociatedObjects = function() {
    // Screens don't have a Has_many relationship with any other objects
    // so there is nothing to do here.
  };
  
  
}(drawingApp));
