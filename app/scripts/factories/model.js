'use strict';

(function (app) {
  function Model() {
    this.initialize.apply(this, arguments);
  }

  Model.$factory = [
    'ENV',
    'Extend',
    '$timeout',
    function(ENV, Extend, $timeout) {
      angular.extend(Model, {
        FBURL: ENV.firebaseUrl,
        $timeout: $timeout
      });

      Model.extend = Extend;

      return Model;
    }];

  app.factory('Model', Model.$factory);

  angular.extend(Model.prototype, EventEmitter.prototype,  {
    initialize: function(futureData) {
      this.initializeAssociations();

      if (!futureData) return;

      if (futureData.on) {
        // We're dealing with a firebase reference.
        this._resource = futureData;
        this._unwrap();
      } else {
        // We're dealing with literal attributes. In this case, the path
        // attribute should be among them.
        if (futureData.path) this.setRef(futureData.path);
        angular.extend(this, futureData);
      }
    },

    initializeAssociations: function() {},

    associations: [],

    destroy: function(success) {
      success || (success = angular.noop);
      this._resource.remove();
      success();
      return this;
    },

    toJSON: function() {
      var json = {};

      for (var prop in this) {
        // Don't include properties starting with underscores or dollar signs.
        if (this.hasOwnProperty(prop) && 
            prop.indexOf('_') !== 0 &&
            prop.indexOf('$') !== 0) {
          // Don't include associations. They can save themselves.
          if (this.associations && this.associations.indexOf(prop) === -1) {
            json[prop] = this[prop];
          }
        }
      }
      return json;
    },

    save: function(attrs) {
      attrs || (attrs = this.toJSON());
      this._resource.update(attrs);
    },

    parseSnapshot: function(name, val) {
      return angular.extend(val, { '$id': name });
    },

    // Ocasionally we have to manually create a reference using a path and
    // the ID of an object. It happens when using models outside of collections
    // for example.
    setRef: function(path) {
      // Strip any leading slash on the path.
      this._resource = new Firebase(Model.FBURL + path.replace(/^\//, ''));
    },

    fetch: function() {
      return this._unwrap(this._resource);
    },
  });

}(drawingApp));
