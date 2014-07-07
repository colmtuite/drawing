'use strict';

describe('Model', function() {
  beforeEach(module('drawingApp'));

  it('should be defined', inject(function(Model) {
    expect(Model).toBeDefined();
  }));
});
