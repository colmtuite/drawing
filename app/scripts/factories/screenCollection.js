'use strict';

(function (app) {
  function ScreenCollection() {
    this.collection = [];
    this.foreignKeyCollection = [];
  }

  ScreenCollection.$factory = [
    'Collection',
    'Screen',
    function(Collection, Screen) {
      angular.extend(ScreenCollection, {
        $model: Screen
      });

      angular.extend(ScreenCollection.prototype, Collection.prototype);

      return ScreenCollection;
    }];

  app.factory('ScreenCollection', ScreenCollection.$factory);

  // This is differnt type of collection to the type the RectangleCollection
  // is. It's different because it's constructed by selecting different
  // screens and putting them intp an array. We have to build it like this
  // because it should only ever contain screens owned by the user.
  //
  // The RectangleCollection on the other hand can (and should) store every
  // rectangle that exists on the server (they're all visible to the user).
  // That's why we can use it's on('child_added') and on('child_removed')
  // events. In the case of this collection, listening to the on('child_added')
  // and on('child_removed') events of '/screens' would trigger changes when
  // any user adds or removes a screen.
  //
  // What we're really trying to do with this collection is wrap the user's
  // ownedScreenIds and fetch from /screens whenever it changes.
  //
  // Thoughts, perhaps I should pass the whole ownedScreenIds collection into
  // this, store it and use it as the url/reference. Then I can attach listeners
  // to it and use them to sync another collection (or just an array) which 
  // holds the actual screen data.

  angular.extend(ScreenCollection.prototype, {
    url: function() {
      return 'screens';
    },

    fetch: function() {
      this.collection.forEach(function(model) { model.fetch(); });
      return this;
    },

    reset: function(futureData) {
      this._unwrap(futureData);
    },

    // Add a screen to the internal collection.
    add: function(model) {
      // Do nothing if the model already exists in the collection. This is
      // what Backbone does.
      // console.log("Model Id", model.$id);
      model = ScreenCollection._initializeModel(model);
      // if (this.get(model.$id)) return;
      this.collection.push(model);
      return model;
    },

    // TODO: Optimistially add the model to the collection.
    create: function(attrs, success) {
      success || (success = angular.noop);
      var newModel = this.resource().push(attrs);
      // angular.extend(attrs, { '$id': newModel.name() });
      this.addForeignKey(newModel.name());
      var model = this.add(newModel);
      success(attrs);
    },

    destroy: function(screen, success) {
      success || (success = angular.noop);
      screen.destroy();
      this.removeForeignKey(screen.$id);
      success(screen);
    },

    addForeignKey: function(key) {
      var data = {};
      data[key] = true;
      this.keyResource.update(data);
    },

    removeForeignKey: function(key) {
      var data = {};
      data[key] = null;
      this.keyResource.update(data);
    },

    _unwrap: function(futureData) {
      this.keyResource = futureData;

      futureData.once('value', function(snap) {
        console.log("Owned screen ids value", snap.name(), snap.val());
        var that = this;
        snap.forEach(function(subSnap) {
          // I have two choices here. I can either pass the $id of the screen
          // or I can pass a reference to the screen. Either way, I end up
          // with a reference to the screen because all I'm doing with the
          // id is using it to build a reference.
          //
          // Reference: that.add(this.resource().child(snap.name()));
          // $id: that.add({ '$id': snap.name() }).fetch();
          //
          // Passing the resource is actually far better because I can call
          // #name on it and get the $id. If I instead pass the $id then
          // I have to do convoluted string concatenation in order to end
          // back with the resource (this is what I've been doing up to this
          // point).
          that.add(that.resource().child(subSnap.name()));
        });

        // I have to listen to this and add models on fire because of the
        // scenario where another user of the app adds this user to a screen
        // to collabourate. In that instance, the screen has to show up in
        // the user's page.
        futureData.on('child_added', function(snap) {
          console.log("Owned screen ids child added", snap.name(), snap.val());
          var model = this.add(this.resource().child(snap.name()));
          // Not sure I can do this in here. Might end up loading every screen
          // even when we don't need them. Will leave it here for the moment.
          //
          // I need it so that the data for a model get's fetched when we
          // create a new screen. Without it, the name of the added screen
          // never shows up on the page.
          //
          // However, it's silly to do things like this anyway. I have the
          // attributes locally anyway so I should be optimistically adding
          // them to the collection instead of waiting for this event to fire.
          //
          // Ideally I should do the initial fetch out in the controller and
          // come up with some way to skip the duplicate #add.
          // model.fetch();
        }, this);

        futureData.on('child_removed', function(snap) {
          // console.log("Owned screen ids child added", snap.name(), snap.val());
          this.remove(snap.name());
        }, this);

      }, this);

    },
  });


  ScreenCollection._initializeModel = function(args) {
    // We may be already dealing with a Screen instance. If we are, we need
    // go no further.
    if (args.constructor.name === "Screen") return args;
    return new this.$model(args);
  };

})(drawingApp);
