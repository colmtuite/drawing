'use strict';

(function (app) {
  // NOTE: The constructor doesn't get run for interited classes. I'll have
  // to build some way of calling super I think.
  function Collection() {}

  Collection.$factory = [
    'FBURL',
    function(FBURL) {
      angular.extend(Collection, {
        FBURL: FBURL,
      });

      return Collection;
    }];

  app.factory('Collection', Collection.$factory);

  angular.extend(Collection.prototype, EventEmitter.prototype,  {

    basePath: function() {
      var url;

      if (_.isFunction(this.url)) {
        url = this.url();
      } else {
        url = this.url;
      }

      return Collection.FBURL + url;
    },

    // TODO: Instead of this, trigger an event whenever the $id changes and
    // update the path that way. Can also update the _resource at the same time.
    resource: function() {
      // NOTE: Collections won't have an $id. This is one place where their
      // #resource method needs to differ from Models.

      var basePath = this.basePath();

      // Only create the resource once. It won't change since the $id won't.
      if (!this._resource) {
        this._resource = new Firebase(basePath);
      }

      return this._resource;
    },

    // If we just set this.collection to a new array literal then any bindings
    // which angular has attached will be lost. Instead, we have empty it.
    empty: function() {
      this.collection.length = 0;
    },

    asArray: function() {
      return this.collection;
    },

    get: function(id) {
      return _.findWhere(this.collection, { '$id': id });
    },

    // Remove a model from the internal collection.
    remove: function(model) {
      var index = this.collection.indexOf(model);
      this.collection.splice(index, 1);
      return model;
    },

  });

}(drawingApp));
