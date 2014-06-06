'use strict';

(function(app) {
  var randomNumber = function(max, min) {
    return Math.floor(Math.random() * max) + 1;
  };

  var randomHex = function() {
    return '#'+ ('000000' + (Math.random()*0xFFFFFF<<0).toString(16)).slice(-6);
  }

  var randomRectAttributes = function() {
    return {
      stroke: randomHex(),
      strokeWidth: 3,
      fill: '#fff',
      x: randomNumber(350),
      y: randomNumber(350),
      width: randomNumber(50),
      height: randomNumber(50)
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
