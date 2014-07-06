'use strict';

(function (app) {
  function User() {
    // Assign this out here so that we can call methods on it before we have
    // actually fetched the data.
    this.ownedScreens = new User.$ScreenCollection();
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

    fetch: function() {
      return this._unwrap(this.resource());
    },

    _unwrap: function(futureData) {
      var that = this;

      futureData.once('value', function(snap) {
        this.$id = snap.name();
        angular.extend(this, snap.val());
        // this._setupAssociatedObjects();
        this.ownedScreens.reset(futureData.child('ownedScreenIds'));
      }, this);

      futureData.on('child_changed', function(newSnap) {
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
