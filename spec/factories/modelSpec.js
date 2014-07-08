'use strict';

describe('Model', function() {
  var FBURL = 'https://drawing-test.firebaseio.com/';

  beforeEach(function() {
    angular.module('appMocks', [])
      .constant('FBURL', FBURL);
    angular.module('testApp', ['drawingApp', 'appMocks'])
    module('testApp');
  });

  it('should be defined', inject(function(Model) {
    expect(Model).toBeDefined();
  }));

  it('should have the correct Firebase URL', inject(function(Model) {
    expect(Model.FBURL).toEqual(FBURL);
  }));

  describe('#setRef', function() {
    var model, spy;

    beforeEach(inject(function(Model) {
      model = new Model();
      spy = sinon.stub(window, "Firebase").returns({ 1: 2 });
    }));

    afterEach(function() {
      spy.restore();
    });

    it('should strip leading slashes', function() {
      model.setRef("/users/45");
      expect(spy.withArgs(FBURL + 'users/45').calledOnce).toBeTruthy();
    });

    it('should assign the _resource', function() {
      model.setRef("/users/45");
      expect(model._resource).toEqual({ 1: 2 });
    });
  });
});
