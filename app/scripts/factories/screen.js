'use strict';

(function (app) {
  var Screen;

  var $factory = [
    'RectangleCollection',
    'Model',
    function(RectangleCollection, Model) {
      Screen = Model.extend(methods, angular.extend({
        $RectangleCollection: RectangleCollection,
      }, classMethods));

      return Screen;
    }];

  app.factory('Screen', $factory);

  var methods = {
    initialize: function(futureData) {
      // Instanciate this even before the data is loaded so that we can call
      // methods on it in the controller without having to wait.
      this.rectangles = new Screen.$RectangleCollection();
      // console.log("Initializing a screen", futureData, futureData.on);

      if (!futureData) return;

      if (futureData.on) {
        // We're dealing with a firebase reference.
        this._resource = futureData;
        this._unwrap();
      } else {
        // We're dealing with literal attributes. In this case, the $id should
        // be among them and we can use it to the the resource via #url.
        angular.extend(this, futureData);
      }
    },

    url: function() { return 'screens/' + this.$id; },

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

    _unwrap: function() {
      var that = this;
      // Loading the screen will also load all it's nested data. That means
      // that all rectangle data is available at this point.
      this.rectangles.reset(this.resource().child('rectangles'));

      this._resource.once('value', function(snap) {
        // console.log("Loaded screen", snap.name(), snap.val());
        // We have to use $timeout here in order to force the UI to refresh.
        // If we don't we can end up with race conditions where sometimes the
        // 'value' event triggers after the UI is rendered and the screens
        // never show up when they're loaded.
        // Note that we can't inject $apply because it's not actually an
        // injectable service. It's defined on the $rootScope. We can inject
        // that but $rootScope.$apply is actually the same thing as $timeout.
        Screen.$timeout(function() {
          that.$id = snap.name();
          // Delete rectangles data so it doesn't overwrite the collection.
          angular.extend(that, _.omit(snap.val(), 'rectangles'));
        });

        // this._setupAssociatedObjects();
      }, this);

      this._resource.on('child_changed', function(newSnap, prevSibling) {
        // We only want to deal with direct attributes of the screen here.
        // The rectangles collection etc. can setup their own listeners
        // and use them to respond to updates.
        if (!newSnap.hasChildren()) {
          console.log("Screen child changed", newSnap.name(), newSnap.val());
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
  };

  var classMethods = {};
}(drawingApp));
