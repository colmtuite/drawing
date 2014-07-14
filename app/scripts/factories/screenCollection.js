'use strict';

(function (app) {
  var ScreenCollection;

  var $factory = [
    'Collection',
    'Screen',
    function(Collection, Screen) {
      ScreenCollection = Collection.extend(methods, angular.extend({
        $model: Screen
      }, classMethods));

      return ScreenCollection;
    }];

  app.factory('ScreenCollection', $factory);

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

  var methods = {
    reset: function(keyReference) {
      this.empty();
      this.keyReference = keyReference;
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

    // Choices and tradeoffs.
    //
    //   1. Initially add on value then add from the create method for future
    //      created screens.
    //      Invalid because server changes never reflected on page.
    //   2. Initially add on child_added then add from the create method for
    //      future created screens.
    //      Slightly worried about it being slow UI when creating new screens
    //      but it doesn't appear to be so that's ok.
    //   3. Initially add on value then add future created screens from the
    //      'child_added' event.
    //      Can only happen if we change #add to reject the duplicate calls it
    //      encounters when using this method.
    //
    // One other semi related issue is the fact that fetching the user
    // automatically causes all screen data to download. This happens because
    // we reset his owned screens collection when we unwrap the user. Doing
    // so will unwrap the screens collection which automatically unwraps each
    // screen in the collection.
    //
    // Ways to fix:
    //
    //   1. Separate the idea of resetting and unwrapping. Load the user and
    //      update the reference in his ownedScreens collection but don't
    //      attach any listeners until told to do so by the controller. That
    //      way we can selectively decide to fetch the screen data or not in
    //      the controller. I have to wait for the user to load before I can
    //      fetch the screens though because I need the keys in place.
    //   2. Leave things as they are (all screens loaded on all pages) but
    //      separate the screens into two separate JSON structures. One tree
    //      holds screen metadata like it's name, the other holds the actual
    //      heavy screen data. Let the metadata load on every page and the
    //      heavy data only load on pages where it is needed.
    //
    // I suspect I will have a better idea what to do after I deal with routing
    // and moving between pages so I will hold off on a decision until then.

    // TODO: Optimistially add the model to the collection.
    create: function(attrs, success) {
      success || (success = angular.noop);
      var newModel = this._resource.push(attrs);
      this.addForeignKey(newModel.name());
      success(attrs);
    },

    destroy: function(screen, success) {
      success || (success = angular.noop);
      screen.destroy();
      this.removeForeignKey(screen.$id);
      success(screen);
    },

    addForeignKey: function(key) {
      this.setForeignKey(key, true);
    },

    removeForeignKey: function(key) {
      this.setForeignKey(key, null);
    },

    setForeignKey: function(key, value) {
      var data = {};
      data[key] = value;
      this.keyReference.update(data);
    },

    _unwrap: function() {
      var that = this;

      this.keyReference.once('value', function(snap) {
        // console.log("Owned screen ids value", snap.name(), snap.val());
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
          // that.add(that.resource().child(subSnap.name()));
        });
        this.trigger('load');
      }, this);

      // I have to listen to this and add models on fire because of the
      // scenario where another user of the app adds this user to a screen
      // to collabourate. In that instance, the screen has to show up in
      // the user's page.
      this.keyReference.on('child_added', function(snap) {
        // console.log("Owned screen ids child added", snap.name(), snap.val());
        ScreenCollection.$timeout(function() {
          that.add(that._resource.child(snap.name()));
          that.trigger('child_added');
        });
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

      this.keyReference.on('child_removed', function(snap) {
        // console.log("Owned screen ids child removed", snap.name(), snap.val());
        ScreenCollection.$timeout(function() {
          that.remove(snap.name());
          that.trigger('child_removed');
        });
      }, this);

    },
  };

  var classMethods = {
    _initializeModel: function(args) {
      // We may be already dealing with a Screen instance. If we are, we need
      // go no further.
      if (args.constructor.name === "Screen") return args;
      return new this.$model(args);
    }
  };

})(drawingApp);
