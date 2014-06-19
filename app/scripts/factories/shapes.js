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

  var randomRectAttributes = function() {
    return {
      name: shapeName('rect'),
      stroke: 'rgb(236, 240, 241)',
      strokeWidth: 1,
      fill: 'rgb(236, 240, 241)',

      isSelected: false,
      isSelecting: false,
      isHighlighted: false,

      // These are the attributes controlled by the DnD module. Any other
      // attributes in this namespace will get smashed when DnD takes
      // control of the positioning.
      dndData: {
        top: randomNumber(350),
        left: randomNumber(350),
        width: randomNumber(100, 50),
        height: randomNumber(100, 50)
      },

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

      style: function() {
        return {
          "background-color": this.fill,
          "border":  this.strokeWidth + 'px solid ' + this.stroke
        };
      },

      previewStyle: function() {
        return $.extend(this.style(), this.dndData);
      },

      select: function() { this.dndData.isSelected = true; },
      deselect: function() { this.dndData.isSelected = false },
      toggleSelected: function() { 
        this.dndData.isSelected = !this.dndData.isSelected
      }
    };
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
