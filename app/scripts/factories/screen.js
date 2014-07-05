'use strict';

(function (app) {
  function Screen(futureData) {
    // Instanciate this even before the data is loaded so that we can call
    // methods on it in the controller without having to wait.
    this.rectangles = new Screen.$RectangleCollection();

    console.log("Instanciating Screen", futureData, this);
    angular.extend(this, futureData);
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

  angular.extend(Screen.prototype, {
    fetch: function() {
      return this._unwrap(this.resource().asObject());
    },

    destroy: function(success) {
      success || (success = angular.noop);
      this.resource().remove().then(success);
      return this;
    },

    update: function(attrs, success) {
      success || (success = angular.noop);
      this.resource().update(attrs).then(success);
    },

    // TODO: Instead of this, trigger an event whenever the $id changes and
    // update the path that way. Can also update the _resource at the same time.
    resource: function(path) {
      if (!this.$id) return;
      var ref;

      if (path) {
        ref = new Firebase(Screen.FBURL + 'screens/' + this.$id + '/' + path);
        return Screen.$firebase(ref);
      // Only create the resource once. It won't change since the $id won't.
      } else if (!this._resource) {
        ref = new Firebase(Screen.FBURL + 'screens/' + this.$id);
        this._resource = Screen.$firebase(ref);
      }

      return this._resource;
    },

    _unwrap: function(futureData) {
      var that = this;

      futureData.loaded().then(function() {
        console.log("Loaded the screen data", futureData);
        // Loading the screen will also load all it's nested data. That means
        // that all rectangle data is available at this point. We need to
        // shove it into the collection.
        that.rectangles.reset(futureData.$data.rectangeles);
        // Now we need to delete it before we overwrite the collection we just
        // populated.
        delete futureData.$data.rectangles;
        angular.extend(that, futureData.$data);
        that._fetchAssociatedObjects();
      });
    },

    _fetchAssociatedObjects: function() {
      // Screens don't have a Has_many relationship with any other objects
      // so there is nothing to do here.
    },
  });

  
  
}(drawingApp));
