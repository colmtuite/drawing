'use strict';

(function(app) {
  var nameList = { group: [] };
  var createName = function() {
    var name = "group-" + (nameList['group'].length + 1);
    nameList['group'].push(name);
    return name;
  };

  var init = function(attrs) {
    var defaults = {
      name: createName(),
      elements: [],
      elementNames: function() {
        return this.elements.map(function(shape) { return shape.name; });
      },
      elementIds: function() {
        return ('#' + this.elementNames().join(', #'));
      },

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
    return angular.extend(defaults, attrs);
  }

  app.factory('GroupsFactory', function() {
    var factory = {};
    var data = [];

    factory.all = function() {
      return data;
    };

    factory.new = function(attrs) {
      var that = this;
      [].concat(attrs || []).map(function(attr) { that.create(attr); });
      return this.all();
    }

    factory.create = function(attrs) {
      data.push(init(attrs));
    };

    return factory;
  });
})(drawingApp);
