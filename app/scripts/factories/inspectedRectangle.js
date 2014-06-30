'use strict';

(function (app) {
  app.factory('InspectedRectangle', factory);

  function factory() {
    var factory = {};
    var inspectedRectangle;

    factory.inspected = function(rectangle) {
      if (typeof rectangle !== "undefined") {
        inspectedRectangle = rectangle;
      }
      // NOTE: It's very important that this returns a reference to data
      // when used as both a setter and getter. Otherwise, we can't set up
      // watchers on the data.
      return inspectedRectangle;
    };

    factory.clear = function() {
      inspectedRectangle = undefined;
    };

    return factory;
  }
}(drawingApp));
