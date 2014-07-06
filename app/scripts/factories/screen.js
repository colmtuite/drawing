'use strict';

var firebaseObjToArray = function(obj) {
  return _.map(obj, function(value, $id) {
    value.$id = $id;
    return value;
  });
};

(function (app) {
  function Screen(futureData) {
    // Instanciate this even before the data is loaded so that we can call
    // methods on it in the controller without having to wait.
    this.rectangles = new Screen.$RectangleCollection();
    angular.extend(this, futureData);
  }

  Screen.$factory = [
    '$timeout',
    'RectangleCollection',
    'FBURL',
    function($timeout, RectangleCollection, FBURL) {
      angular.extend(Screen, {
        $timeout: $timeout,
        $RectangleCollection: RectangleCollection,
        FBURL: FBURL
      });

      return Screen;
    }];

  app.factory('Screen', Screen.$factory);

  angular.extend(Screen.prototype, EventEmitter.prototype, {
    fetch: function() {
      var futureData = this.resource();
      return this._unwrap(futureData);
    },

    destroy: function(success) {
      success || (success = angular.noop);
      this.resource().remove();
      success();
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
      var ref,
          basePath = Screen.FBURL + 'screens/' + this.$id;

      if (path) {
        return new Firebase(basePath + '/' + path);
      // Only create the resource once. It won't change since the $id won't.
      } else if (!this._resource) {
        this._resource = new Firebase(basePath);
      }

      return this._resource;
    },

    _unwrap: function(futureData) {
      var that = this;

      futureData.on('value', function(snap) {
        // console.log("Screen futuredata loaded", that, snap.val());
        Screen.$timeout(function() {
          angular.extend(that, snap.val());
        });
        that._fetchAssociatedObjects();
        that.trigger('value');
      });

      // this.loaded().then(function() {
      //   // Loading the screen will also load all it's nested data. That means
      //   // that all rectangle data is available at this point. We need to
      //   // shove it into the collection.
      //   // angular.extend(that.rectangles, { '$screenId': futureData.$id });
      //   // that.rectangles.reset(firebaseObjToArray(futureData.$data.rectangles));
      //   // Now we need to delete it before we overwrite the collection we just
      //   // populated.
      //   // TODO: I think I'm going to have to start storing $data rather
      //   // than it's internals. Might help to keep things in sync with the
      //   // server.
      // });
    },

    _fetchAssociatedObjects: function() {
      // Screens don't have a Has_many relationship with any other objects
      // so there is nothing to do here.
    },
  });
}(drawingApp));
