'use strict';

(function (app) {
  var Screen;

  var $factory = [
    'RectangleCollection',
    'InteractionCollection',
    'StateInteractionCollection',
    'Model',
    function(RectangleCollection, InteractionCollection, StateInteractionCollection, Model) {
      Screen = Model.extend(methods, angular.extend({
        $RectangleCollection: RectangleCollection,
        $InteractionCollection: InteractionCollection,
        $StateInteractionCollection: StateInteractionCollection
      }, classMethods));

      return Screen;
    }];

  app.factory('Screen', $factory);

  var methods = {
    initializeAssociations: function() {
      var that = this;

      // Instanciate this even before the data is loaded so that we can call
      // methods on it in the controller without having to wait.
      this.associations.forEach(function(name) {
        // NOTE: I'm having trouble moving this up into Model because
        // it calls 'new Screen.RectangleCollection' (for example). That
        // class isn't defined on Model and thus is unfound when it goes
        // looking for it.
        that[name] = new Screen['$' + _.classify(name) + 'Collection']();
      });
    },

    associations: ['rectangles', 'interactions', 'stateInteractions'],

    _unwrap: function() {
      var that = this;
      // Loading the screen will also load all it's nested data. That means
      // that all rectangle data is available at this point.
      this.associations.forEach(function(name) {
        that[name].reset(that._resource.child(name));
      });

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
          var data = that.parseSnapshot(snap.name(), snap.val());
          data = _.omit(data, that.associations);
          angular.extend(that, data);
          that.trigger('load');
        });
      }, this);

      this._resource.on('child_changed', function(newSnap, prevSibling) {
        // We only want to deal with direct attributes of the screen here.
        // The rectangles collection etc. can setup their own listeners
        // and use them to respond to updates.
        if (!newSnap.hasChildren()) {
          Screen.$timeout(function() {
            that[newSnap.name()] = newSnap.val();
            that.trigger('child_changed');
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
