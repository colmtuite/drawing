'use strict';

(function(app) {
  var nameList = { group: [] };
  var createName = function() {
    var name = "group-" + (nameList['group'].length + 1);
    nameList['group'].push(name);
    return name;
  };

  app.factory('GroupsFactory', function() {
    var factory = {};
    var data = [];

    factory.all = function() {
      return data;
    };

    factory.create = function(attrs) {
      var defaults = {
        name: createName()
      };
      data.push(angular.extend(defaults, attrs));
    };

    return factory;
  });
})(drawingApp);
