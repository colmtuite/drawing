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
    // console.log("Initializing a screen", futureData, futureData.on);

    if (futureData.on) {
      // We're dealing with a firebase reference.
      this._resource = futureData;
      this._unwrap(futureData);
    } else {
      // We're dealing with literal attributes. In this case, the $id should
      // be among them and we can use it to the the resource via #url.
      angular.extend(this, futureData);
    }
  }

  Screen.$factory = [
    '$timeout',
    'RectangleCollection',
    'Model',
    function($timeout, RectangleCollection, Model) {
      angular.extend(Screen, {
        $timeout: $timeout,
        $RectangleCollection: RectangleCollection,
      });

      angular.extend(Screen.prototype, Model.prototype);

      return Screen;
    }];

  app.factory('Screen', Screen.$factory);

  angular.extend(Screen.prototype, {
    url: function() { return 'screens/' + this.$id; },

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

    _unwrap: function(futureData) {
      var that = this;

      futureData.once('value', function(snap) {
        // console.log("Loaded screen", snap.name(), snap.val());
        // // console.log("Screen futuredata loaded", that, snap.val());
        // Loading the screen will also load all it's nested data. That means
        // that all rectangle data is available at this point. We need to
        // shove it into the collection.
        this.rectangles.reset(this.resource().child('rectangles'));
        this.$id = snap.name();

        Screen.$timeout(function() {
          // Now we need to delete it before we overwrite the collection we just
          // populated.
          angular.extend(that, _.omit(snap.val(), 'rectangles'));
        });

        // this._setupAssociatedObjects();
      }, this);

      futureData.on('child_changed', function(newSnap, prevSibling) {
        console.log("Screen child changed", newSnap.name(), newSnap.val());

        // We only want to deal with direct attributes of the screen here.
        // The rectangles collection etc. can setup their own listeners
        // and use them to respond to updates.
        if (!newSnap.hasChildren()) {
          Screen.$timeout(function() {
            that[newSnap.name()] = newSnap.val();
          });
        }

        // If the new snap has the key of rectangles then one of the children
        // other than the rectangles must have changed.
        // if (newSnap.val().rectangles) {
        //   angular.extend(that, _.omit(snap.val(), 'rectangles'));
        // } else {
        //   Screen.$timeout(function() {
        //     that.rectangles.reset(firebaseObjToArray(newSnap.val()));
        //   });
        // }
      }, this);
    },

    // _setupAssociatedObjects: function() {
    //   // Screens don't have a Has_many relationship with any other objects
    //   // so there is nothing to do here.
    // },
  });
}(drawingApp));
