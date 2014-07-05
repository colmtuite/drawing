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

  angular.extend(User.prototype, {
    fetch: function() {
      return this._unwrap(this.resource().asObject());
    },

    addOwnedScreenId: function(id, success) {
      success || (success = angular.noop);
      var ownedScreens = this.resource('ownedScreenIds').asObject();
      ownedScreens.$data[id] = true;
      ownedScreens.save().then(success);
    },

    removeOwnedScreenId: function(id, success) {
      success || (success = angular.noop);
      var ownedScreens = this.resource('ownedScreenIds').asObject();
      delete ownedScreens.$data[id];
      ownedScreens.save().then(success);
    },

    _unwrap: function(futureData) {
      var that = this;

      futureData.loaded().then(function() {
        console.log("Unwrapped the user", futureData);
        angular.extend(that, futureData.$data);
        that._fetchAssociatedObjects();
      });
    },

    // TODO: Instead of this, trigger an event whenever the $id changes and
    // update the path that way. Can also update the _resource at the same time.
    resource: function(path) {
      if (!this.$id) return;
      var ref;

      if (path) {
        ref = new Firebase(User.FBURL + 'users/' + this.$id + '/' + path);
        return User.$firebase(ref);
      // Only create the resource once. It won't change since the $id won't.
      } else if (!this._resource) {
        ref = new Firebase(User.FBURL + 'users/' + this.$id);
        this._resource = User.$firebase(ref);
      }

      return this._resource;
    },

    _fetchAssociatedObjects: function() {
      // User's have a has_many relationship with screens. We need to load
      // the user's screens here so that we can show them to him.
      console.log("Resetting with", this.ownedScreenIds);
      this.ownedScreens.reset(_.keys(this.ownedScreenIds));
    }
  });

  User.prototype.update = function(attrs) {
    User.$firebase(this.path()).$update(attrs);
  };
})(drawingApp);
