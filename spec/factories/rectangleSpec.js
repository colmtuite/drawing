'use strict';

describe('Rectangle', function() {
  var FBURL = 'https://drawing-test.firebaseio.com/';

  beforeEach(function() {
    angular.module('appMocks', []).constant('ENV', {
      name: 'test',
      firebaseUrl: FBURL
    });
    angular.module('testApp', ['drawingApp', 'appMocks'])
    module('testApp');
  });

  describe('#initializeAssociations', function() {
    var model;

    beforeEach(inject(function(Rectangle) {
      model = new Rectangle();
    }));

    it('should initialize the states', function() {
      expect(model.states).toEqual({ normal: {} });
    });
  });

  describe('#style', function() {
    var model;

    beforeEach(inject(function(Rectangle) {
      model = new Rectangle({
        states: {
          normal: {
            fill: 'blue',
            strokeWidth: 3,
            stroke: 'red'
          }, 
          hover: {
            fill: 'green',
            strokeWidth: 3,
            stroke: 'pink'
          }
        }
      });
    }));

    it('should return normal styling by default', function() {
      expect(model.style()['background-color']).toEqual('blue');
    });

    it('should return the styling matching the argument', function() {
      expect(model.style('hover')['background-color']).toEqual('green');
    });

    it('should return {} on initialization', function() {
      model.states = { normal: {} };
      expect(model.style()['stroke']).not.toBeDefined();
    });
  });
});
