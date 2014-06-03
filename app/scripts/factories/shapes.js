'use strict';

(function(app) {
  var randomNumber = function(max) {
    return Math.floor(Math.random() * max) + 1;
  };

  var randomHex = function() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
  }

  var baseShapeAttributes = function() {
    return {
      stroke: randomHex(),
      strokeWidth: 3,
      fill: '#fff',
    };
  };

  var randomRectAttributes = function() {
    return angular.extend(baseShapeAttributes(), {
      x: randomNumber(350),
      y: randomNumber(350),
      width: randomNumber(50),
      height: randomNumber(50),
      tagName: 'rect'
    });
  }

  var randomCircleAttributes = function() {
    return angular.extend(baseShapeAttributes(), {
      cx: randomNumber(350),
      cy: randomNumber(350),
      r: randomNumber(50),
      tagName: 'circle'
    });
  }

  var randomShapeAttributes = function(shape) {
    shape || (shape = randomNumber(2) === 1 ? 'rect' : 'circle');
    if (shape === 'rect') {
      return randomRectAttributes();
    } else {
      return randomCircleAttributes();
    }
  };

  app.factory('ShapesFactory', function() {
    var factory = {};
    var data = [randomShapeAttributes('rect'), randomShapeAttributes('rect')];

    factory.all = function() {
      return data;
    };

    factory.create = function(shape) {
      data.push(randomShapeAttributes(shape));
    };

    return factory;
  });

})(drawingApp);
