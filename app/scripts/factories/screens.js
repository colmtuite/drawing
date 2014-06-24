'use strict';

(function(app) {
  app.factory('ScreensFactory', ['$filter', '$resource', factory]);
  
  function factory($filter, $resource) {
    var factory = {};
    var ScreensService = $resource('//localhost:3000/screens/:id.json', {}, {
      create: { method: 'POST' },
      index: { method: 'GET' },
      show: { method: 'GET' },
      destroy: { method: 'DELETE' }
    });

    factory.all = function() {
      return ScreensService.index().$promise;
    };

    factory.find = function(slug) {
      return ScreensService.show({ id: slug }).$promise;
    };

    factory.create = function(attrs) {
      return ScreensService.create({ screen: attrs }).$promise;
    }

    factory.destroy = function(screen) {
      return ScreensService.destroy({ id: screen.id }).$promise;
    }

    return factory;
  }
})(drawingApp);
