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
    initializeAssociations: function() {
      this.ownedScreens = new User.$ScreenCollection({ path: '/screens' });
    },

    toJSON: function() {
      return _.pick(this, 'email', 'provider');
    },

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
          var data = that.parseSnapshot(snap.name(), snap.val());
          data = _.omit(data, that.associations);
          angular.extend(that, data);
          that.trigger('load');
        });
      }, this);

      this._resource.on('child_changed', function(newSnap) {
        if (!newSnap.hasChildren()) {
          Screen.$timeout(function() {
            that[newSnap.name()] = newSnap.val();
            that.trigger('child_changed');
          });
        }
      }, this);

    },
  };

  var classMethods = {

  };
})(drawingApp);
