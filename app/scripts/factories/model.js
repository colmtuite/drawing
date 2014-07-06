'use strict';

(function (app) {
  function Model() {}

  Model.$factory = [
    'FBURL',
    function(FBURL) {
      angular.extend(Model, {
        FBURL: FBURL,
      });

      return Model;
    }];

  app.factory('Model', Model.$factory);

  angular.extend(Model.prototype, EventEmitter.prototype,  {

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
  });

}(drawingApp));
