'use strict';

drawingApp.factory('ScreensFactory', ['$filter', function($filter) {
  var factory = {};
  var data = [{
    name: 'Screen one',
    slug: 'screen-one'
  }, {
    name: 'Screen two',
    slug: 'screen-two'
  }];

  factory.all = function() {
    return data;
  };

  factory.find = function(slug) {
    return $filter('filter')(data, { slug: slug }, true)[0];
  };

  return factory;
}]);
