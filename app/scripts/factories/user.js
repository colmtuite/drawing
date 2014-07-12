'use strict';

(function (app) {
  var User;

  var $factory = [
    'ScreenCollection',
    'Model',
    function(ScreenCollection, Model) {
      User = Model.extend(methods, angular.extend({
        $ScreenCollection: ScreenCollection,
      }, classMethods));

      return User;
    }];

  app.factory('User', $factory);

  var methods = {
    initialize: function(futureData) {
      // Assign this out here so that we can call methods on it before we have
      // actually fetched the data.
      this.ownedScreens = new User.$ScreenCollection();

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

    toJSON: function() {
      return _.pick(this, 'email', 'provider');
    },

    url: function() {
      return 'users/' + this.$id;
    },

    // TODO: I'm pretty sure there is no need to pass this in. I can just call
    // whatever I want on this._resource once it is set.
    _unwrap: function() {
      var that = this;

      // There is no need for me to wait until the 'value' event to pass
      // in this reference. I can pass it in as soon user._resource is set.
      // It will then resolve when it is good and ready.
      // Keep in mind that I've already fetched the user's data from Firebase
      // so this #child operation doesn't incur any extra downloading cost.
      this.ownedScreens.reset(this._resource.child('ownedScreenIds'));

      this._resource.once('value', function(snap) {
        User.$timeout(function() {
          that.$id = snap.name();
          angular.extend(that, snap.val());
          that.trigger('load');
        });
      }, this);

      this._resource.on('child_changed', function(newSnap) {
        if (!newSnap.hasChildren()) {
          console.log("user child changed", newSnap.name(), newSnap.val());
          Screen.$timeout(function() {
            that[newSnap.name()] = newSnap.val();
          });
        }
      }, this);

    },
  };

  var classMethods = {

  };
})(drawingApp);
