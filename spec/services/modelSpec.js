'use strict';

describe('Model', function() {
  beforeEach(function() {
    angular.module('appMocks', [])
      .constant('FBURL', 'https://drawing-test.firebaseio.com/');
    angular.module('testApp', ['drawingApp', 'appMocks'])
    module('testApp');
  });

  it('should be defined', inject(function(Model) {
    expect(Model).toBeDefined();
  }));

  it('should have the correct Firebase URL', inject(function(Model) {
    expect(Model.FBURL).toEqual('https://drawing-test.firebaseio.com/');
  }));
});
