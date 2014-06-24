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
      return Service.update({ id: screen.id }, attrs).$promise;
    }

    factory.destroy = function(screen) {
      return Service.destroy({ id: screen.id }).$promise;
    }

    return factory;
  }
})(drawingApp);
