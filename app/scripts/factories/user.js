'use strict';

(function (app) {
  function User() {
    // Assign this out here so that we can call methods on it before we have
    // actually fetched the data.
    this.ownedScreens = new User.$ScreenCollection();
  }

  User.$factory = [
    'ScreenCollection',
    '$firebase',
    'FBURL',
    function(ScreenCollection, $firebase, FBURL) {
      angular.extend(User, {
        $ScreenCollection: ScreenCollection,
        $firebase: $firebase,
        FBURL: FBURL
      });

      return User;
    }];

  app.factory('User', User.$factory);

  User.prototype.setUid = function(uid) {
    this.uid = uid;
    // The uid has changed so we want to reload everything.
    this.$load();
  };

  User.prototype.$load = function() {
    var path = this.path();
    if (!path) return;
    return this.$unwrap(User.$firebase(path));
  };

  User.prototype.$update = function(attrs) {
    User.$firebase(this.path()).$update(attrs);
  };

  User.prototype.$addOwnedScreenId = function(id) {
    var data = {};
    data[id] = true;
    User.$firebase(this.path()).$child('ownedScreenIds').$update(data);
  };

  User.prototype.path = function() {
    if (!this.uid) return;

    // Only create the path once. It won't change since the uid won't.
    if (!this.$$path) {
      this.$$path = new Firebase(User.FBURL + 'users/' + this.uid);
    }

    return this.$$path;
  };

  User.prototype.$unwrap = function(futureData) {
    var that = this;
    futureData.$on('loaded', function(data) {
      angular.extend(that, data);
      that._fetchAssociatedObjects();
    });
  };

  User.prototype._fetchAssociatedObjects = function() {
    // User's have a has_many relationship with screens. We need to load
    // the user's screens here so that we can show them to him.
    console.log("Resetting with", this.ownedScreenIds);
    this.ownedScreens.$reset(_.keys(this.ownedScreenIds));
  };
})(drawingApp);
