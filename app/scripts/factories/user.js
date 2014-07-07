'use strict';

(function (app) {
  function User(futureData) {
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
  }

  User.$factory = [
    'ScreenCollection',
    'Model',
    function(ScreenCollection, Model) {
      angular.extend(User, {
        $ScreenCollection: ScreenCollection,
      });

      angular.extend(User.prototype, Model.prototype);

      return User;
    }];

  app.factory('User', User.$factory);

  angular.extend(User.prototype, {
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
        this.$id = snap.name();
        angular.extend(this, snap.val());
        // this._setupAssociatedObjects();
        this.trigger('load');
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

    // _setupAssociatedObjects: function() {
    //   // User's have a has_many relationship with screens. We need to store
    //   // the user's screen ids here so that we can fetch them later.
    //   this.ownedScreens.reset(this.ownedScreenIds);
    // }
  });
})(drawingApp);
