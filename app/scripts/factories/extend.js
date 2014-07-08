'use strict';

(function (app) {
  var $factory = [
    function() {
      // This is copied from BackboneJS. It is used to subclass a class
      // while correctly setting up the prototype chain.
      // INFO: http://backbonejs.org/docs/backbone.html#section-206
      return function(protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && _.has(protoProps, 'constructor')) {
          child = protoProps.constructor;
        } else {
          child = function() { return parent.apply(this, arguments); };
        }

        _.extend(child, parent, staticProps);

        var Surrogate = function() { this.constructor = child };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        if (protoProps) _.extend(child.prototype, protoProps);
          
        child.__super__ = parent.prototype;
        return child;
      }
    }];

  app.factory('Extend', $factory);
})(drawingApp);
