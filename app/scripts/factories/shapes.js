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
      x: randomNumber(350),
      y: randomNumber(350),
      width: randomNumber(100, 50),
      height: randomNumber(100, 50),
      selected: false,
      style: function() {
        return {
          position: 'relative',
          "top": this.y,
          "left": this.x,
          "background-color": this.fill,
          width: this.width + "px",
          height: this.height + "px",
          "border":  this.strokeWidth + 'px solid ' + this.stroke
        }
      },
      select: function() { this.selected = true; },
      deselect: function() { this.selected = false },
      toggleSelected: function() { this.selected = !this.selected }
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
