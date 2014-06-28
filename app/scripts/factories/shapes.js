'use strict';

(function(app) {
  var init = function(options) {
    options || (options = {});
    var guid = options.guid || chance.guid(),
        name = options.name || chance.word();
    delete options.guid;
    delete options.name;

    return angular.extend({
      name: name,
      guid: guid,
      // This method is here for consistency with the Group object. Often we
      // want to get the names of shapes which may be either groups or
      // individual shapes without type checking constantly.
      elementNames: function() { return [this.name]; },
      elementIds: function() {
        return ('#' + this.elementNames().join(', #'));
      },

      // Styling States
      // ==============

      // TODO: Refactor this to the following structure:
      //
      // states: {
      //   normal: {
      //     stroke: '',
      //     etc...
      //   },
      //   hover: { etc... }
      //   etc..
      // }
      states: [{name: 'normal' }, { name: 'hover' }],

      normal: {
        stroke: 'rgb(236, 240, 241)',
        strokeWidth: 1,
        fill: 'rgb(236, 240, 241)',
      },

      hover: {
        stroke: 'rgb(236, 240, 241)',
        strokeWidth: 1,
        fill: 'rgb(236, 240, 0)',
      },

      style: function(state) {
        state || (state = this.states[0].name);
        return {
          "background-color": this[state].fill,
          "border":  this[state].strokeWidth + 'px solid ' + this[state].stroke
        };
      },

      previewStyle: function(state) {
        return $.extend(this.style(state), this.dndData);
      },

      // Edit States
      // ===========

      isSelected: false,
      isSelecting: false,
      isHighlighted: false,

      select: function() { this.isSelected = true; },
      deselect: function() { this.isSelected = false },
      toggleSelected: function() { 
        this.isSelected = !this.isSelected
      },

      // These are the attributes controlled by the DnD module. Any other
      // attributes in this namespace will get smashed when DnD takes
      // control of the positioning.
      dndData: {
        top: chance.natural({ max: 350 }),
        left: chance.natural({ max: 350 }),
        width: chance.natural({ max: 100, min: 50 }),
        height: chance.natural({ max: 100, min: 50 })
      },

      // Positioning Getters
      // ===================

      top: function() { return parseInt(this.dndData.top, 10); },
      left: function() { return parseInt(this.dndData.left, 10); },
      bottom: function() {
        return (parseInt(this.dndData.top, 10) + parseInt(this.dndData.height, 10));
      },
      right: function() {
        return (parseInt(this.dndData.left, 10) + parseInt(this.dndData.width, 10));
      },
      width: function() { return parseInt(this.dndData.width, 10) },
      height: function() { return parseInt(this.dndData.height, 10) },

      toJSON: function() {
        var json = _.pick(this, 'name', 'normal', 'hover', 'dndData',
          'isSelected', 'isHighlighted', 'isSelecting');
        return json;
      }
    }, options);
  }

  app.factory('RectFactory', ['$filter', factory]);

  function factory($filter) {
    var factory = {};
    var data = { rects: [] };

    factory.all = function() {
      return data.rects;
    }

    factory.new = function(attrs) {
      var that = this;
      [].concat(attrs || []).map(function(attr) { that.create(attr); });
      return this.all();
    }

    factory.create = function(attrs) {
      data.rects.push(init(attrs));
    }

    factory.destroy = function(shape) {
      this.clearInspectedShape();
      data.rects.splice(data.rects.indexOf(shape), 1);
      return shape;
    }

    factory.selected = function() {
      return $filter('filter')(data.rects, {isSelected: true});
    }

    // This is here so that numerous controllers can keep track of which is
    // the currently inspected shape.
    factory.inspectedShape = function(rectangle) {
      if (typeof rectangle !== "undefined") {
        data.inspectedShape = rectangle;
      }
      // NOTE: It's very important that this returns a reference to data
      // when used as both a setter and getter. Otherwise, we can't set up
      // watchers on the data.
      return data.inspectedShape;
    }

    factory.clearInspectedShape = function() {
      delete data.inspectedShape;
    }

    return factory;
  }

})(drawingApp);
