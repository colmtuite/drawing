'use strict';

(function (app) {
  function Model() {
    this.initialize.apply(this, arguments);
  }

  Model.$factory = [
    'FBURL',
    'Extend',
    '$timeout',
    function(FBURL, Extend, $timeout) {
      angular.extend(Model, {
        FBURL: FBURL,
        $timeout: $timeout
      });

      Model.extend = Extend;

      return Model;
    }];

  app.factory('Model', Model.$factory);

  angular.extend(Model.prototype, EventEmitter.prototype,  {
    initialize: function() {},

    // Ocasionally we have to manually create a reference using a path and
    // the ID of an object. It happens when using models outside of collections
    // for example.
    setRef: function(path) {
      // Strip any leading slash on the path.
      this._resource = new Firebase(Model.FBURL + path.replace(/^\//, ''));
    },

    basePath: function() {
      var url;

      if (_.isFunction(this.url)) {
        url = this.url();
      } else {
        url = this.url;
      }

      return Model.FBURL + url;
    },

    // TODO: Instead of this, trigger an event whenever the $id changes and
    // update the path that way. Can also update the _resource at the same time.
    resource: function() {
      var basePath = this.basePath();

      // Only create the resource once. It won't change since the $id won't.
      if (!this._resource) {
        this._resource = new Firebase(basePath);
      }

      return this._resource;
    },

    fetch: function() {
      return this._unwrap(this.resource());
    },
  });

}(drawingApp));
