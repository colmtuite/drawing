'use strict';

(function(app) {
  app.factory('ScreensFactory', ['$filter', '$resource', factory]);
  
  function factory($filter, $resource) {
    var factory = {};

    var Service = $resource('//localhost:3000/screens/:id.json', {}, {
      create: { method: 'POST' },
      index: { method: 'GET' },
      show: { method: 'GET' },
      update: { method: 'PUT' },
      destroy: { method: 'DELETE' }
    });

    factory.all = function() {
      return Service.index().$promise;
    };

    factory.find = function(slug) {
      return Service.show({ id: slug }).$promise;
    };

    factory.create = function(attrs) {
      return Service.create({ screen: attrs }).$promise;
    }

    factory.update = function(screen, attrs) {
      attrs || (attrs = screen);
      // TODO: I'm doing this toJSON type manipulation in the model in the
      // case of rectanges. I should be doing the same thing here.
      attrs = _.omit(attrs, 'id', 'slug');
      return Service.update({ id: screen.id }, { screen: attrs }).$promise;
    }

    factory.destroy = function(screen) {
      return Service.destroy({ id: screen.id }).$promise;
    }

    return factory;
  }
})(drawingApp);
