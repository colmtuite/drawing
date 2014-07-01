'use strict';

(function (app) {
  function ScreenCollection() {
    this.collection = [];
  }

  ScreenCollection.$factory = [
    '$firebase',
    'FBURL',
    'Screen',
    function($firebase, FBURL, Screen) {
      var path = new Firebase(FBURL + 'screens');
      angular.extend(ScreenCollection, {
        $$path: path,
        $firebase: $firebase,
        // This is a base level collection so it needs a direct resource
        // reference.
        $$resource: $firebase(path),
        $model: Screen,
      });

      return ScreenCollection;
    }];

  app.factory('ScreenCollection', ScreenCollection.$factory);

  // If we just set this.collection to a new array literal then any bindings
  // which angular has attached will be lost. Instead, we have empty it.
  ScreenCollection.prototype.empty = function() {
    this.collection.length = 0;
  };

  ScreenCollection.prototype.$reset = function(uids) {
    this.empty();

    var that = this;
    _.map(([].concat(uids) || []), function(uid) {
      that.add({ uid: uid });
    });
  }

  ScreenCollection.prototype.$find = function(uid) {
    var ref = ScreenCollection.$$resource.$child(uid)
    return new ScreenCollection.$Screen(ref);
  };

  // TODO: Optimistially add the model to the collection.
  ScreenCollection.prototype.$create = function(attrs, success) {
    success || (success = angular.noop());
    var that = this;
    // Be sure to return the promise so we can chain more actions onto it.
    return ScreenCollection.$$resource.$add(attrs).then(function(data) {
      var model = that.add(attrs);
      model.setUid(data.name());
      success(model);
    });
  };

  ScreenCollection._initializeModel = function(args) {
    return new this.$model(args);
  };

  // Add a screen to the internal collection.
  ScreenCollection.prototype.add = function(model) {
    if (model.constructor.name !== "Screen") {
      model = ScreenCollection._initializeModel(model);
    }
    this.collection.push(model);
    return model;
  };

  // This pattern is only useful if we want to change the client whenever
  // ANY screen is added, removed or destroyed on the server. This usually
  // is not what we want. Imagine we have two users, if we bind to all events
  // then a screen created by user 1 will show up in user two's collection.
  //
  // TODO: Or will it!? Perhaps the security settings will prevent an event
  // being triggered for user 2. I should test this.
  // ScreenCollection.prototype.$unwrapCollection = function(futureData) {
  //   var that = this;

  //   futureData.$on('child_added', function(data) {
  //     var uid = data.snapshot.name, value = data.snapshot.value;
  //     that.add(uid, value);
  //   });

  //   futureData.$on('child_removed', function(data) {
  //     delete that.collection[data.snapshot.name];
  //   });

  //   futureData.$on('child_changed', function(ref) {
  //     angular.extend(that.collection[ref.snapshot.name], ref.snapshot.value);
  //   });

  //   return this.collection;
  // };
})(drawingApp);
