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

  it('should be defined', inject(function(Rectangle) {
    expect(Rectangle).toBeDefined();
  }));

  describe('#initializeAssociations', function() {
    var model;

    beforeEach(inject(function(Rectangle) {
      model = new Rectangle();
    }));

    it('should initialize the states', function() {
      expect(model.states).toEqual([]);
    });
  });
});
