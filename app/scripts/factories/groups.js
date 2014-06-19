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
        name: createName(),
        elements: [],

        top: function() {
          if (_.isEmpty(this.elements)) return 0;
          return _.min(this.elements.map(function(el) { return el.top(); }));
        },

        left: function() {
          if (_.isEmpty(this.elements)) return 0;
          return _.min(this.elements.map(function(el) { return el.left(); }));
        },

        bottom: function() {
          if (_.isEmpty(this.elements)) return 0;
          return _.max(this.elements.map(function(el) { return el.bottom(); }));
        },

        right: function() {
          if (_.isEmpty(this.elements)) return 0;
          return _.max(this.elements.map(function(el) { return el.right(); }));
        },

        height: function() {
          if (_.isEmpty(this.elements)) return 0;
          return this.bottom() - this.top();
        },

        width: function() {
          if (_.isEmpty(this.elements)) return 0;
          return this.right() - this.left();
        },

        style: function() {
          return {
            top: this.top() + 'px',
            left: this.left() + 'px',
            height: this.height() + 'px',
            width: this.width() + 'px'
          };
        }
      };
      data.push(angular.extend(defaults, attrs));
    };

    return factory;
  });
})(drawingApp);
