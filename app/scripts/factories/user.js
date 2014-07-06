'use strict';

(function (app) {
  function User() {
    // Assign this out here so that we can call methods on it before we have
    // actually fetched the data.
    this.ownedScreens = new User.$ScreenCollection();
  }

  User.$factory = [
    'ScreenCollection',
    'FBURL',
    function(ScreenCollection, FBURL) {
      angular.extend(User, {
        $ScreenCollection: ScreenCollection,
        FBURL: FBURL
      });

      return User;
    }];

  app.factory('User', User.$factory);

  angular.extend(User.prototype, EventEmitter.prototype, {
    fetch: function() {
      // NOTE: Calling #asObject() is what triggers the actual download.
      var futureData = this.resource();
      return this._unwrap(futureData);
    },

    addOwnedScreenId: function(id, success) {
      success || (success = angular.noop);
      var ownedScreens = this.resource('ownedScreenIds');
      var data = {};
      data[id] = true;
      ownedScreens.update(data);
      success();
    },

    removeOwnedScreenId: function(id, success) {
      success || (success = angular.noop);
      var ownedScreens = this.resource('ownedScreenIds');
      var data = {};
      data[id] = null;
      ownedScreens.update(data);
      success();
    },

    _unwrap: function(futureData) {
      var that = this;

      futureData.once('value', function(snap) {
        console.log("user value", snap.val());
        angular.extend(this, snap.val());
        this._setupAssociatedObjects();
        this.trigger('value');
      }, this);

      futureData.on('child_changed', function(snap) {
        angular.extend(this, snap.val());
      }, this);
    },

    // TODO: Instead of this, trigger an event whenever the $id changes and
    // update the path that way. Can also update the _resource at the same time.
    resource: function(path) {
      if (!this.$id) return;
      var ref,
          basePath = User.FBURL + 'users/' + this.$id

      if (path) {
        return new Firebase(basePath + '/' + path);
      // Only create the resource once. It won't change since the $id won't.
      } else if (!this._resource) {
        this._resource = new Firebase(basePath);
      }

      return this._resource;
    },

    _setupAssociatedObjects: function() {
      // User's have a has_many relationship with screens. We need to store
      // the user's screen ids here so that we can fetch them later.
      this.ownedScreens.reset(_.keys(this.ownedScreenIds));
    }
  });
})(drawingApp);
