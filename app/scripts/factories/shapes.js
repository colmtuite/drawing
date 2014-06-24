'use strict';

(function(app) {
  var randomNumber = function(max, min) {
    min || (min = 1);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var randomHex = function() {
    return '#'+ ('000000' + (Math.random()*0xFFFFFF<<0).toString(16)).slice(-6);
  }

  var nameList = { rect: [] };
  var shapeName = function(shapeType) {
    var name = shapeType + "-" + (nameList[shapeType].length + 1);
    nameList[shapeType].push(name);
    return name;
  };

  var randomRectAttributes = function(options) {
    return $.extend({
      name: shapeName('rect'),
      // This method is here for consistency with the Group object. Often we
      // want to get the names of shapes which may be either groups or
      // individual shapes without type checking constantly.
      elementNames: function() { return [this.name]; },
      elementIds: function() {
        return ('#' + this.elementNames().join(', #'));
      },

      // Styling States
      // ==============

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
        top: randomNumber(350),
        left: randomNumber(350),
        width: randomNumber(100, 50),
        height: randomNumber(100, 50)
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

      style: function(state) {
        state || (state = "normal");
        return {
          "background-color": this[state].fill,
          "border":  this[state].strokeWidth + 'px solid ' + this[state].stroke
        };
      },

      previewStyle: function() {
        return $.extend(this.style(), this.dndData);
      },
    }, options);
  }

  app.factory('RectFactory', function() {
    var factory = {};
    var data = [randomRectAttributes(), randomRectAttributes()];

    factory.all = function() {
      return data;
    };

    factory.create = function() {
      data.push(randomRectAttributes());
    };

    return factory;
  });

})(drawingApp);
