'use strict';

(function(app) {
  function Rectangle(data) {
    angular.extend(this, data);
  }

  Rectangle.$factory = [
    '$filter',
    function($filter) {
      angular.extend(Rectangle, {
        $filter: $filter
      });

      return Rectangle;
    }];

  app.factory('Rectangle', Rectangle.$factory);

  Rectangle.prototype.style = function(state) {
    state || (state = this.states[0].name);
    return {
      "background-color": this[state].fill,
      "border":  this[state].strokeWidth + 'px solid ' + this[state].stroke
    };
  };

  Rectangle.prototype.previewStyle = function(state) {
    return $.extend(this.style(state), this.dndData);
  };
  
  // This method is here for consistency with the Group object. Often we
  // want to get the names of shapes which may be either groups or
  // individual shapes without type checking constantly.
  Rectangle.prototype.elementNames = function() {
    return [this.name];
  };

  Rectangle.prototype.elementIds = function() {
    return ('#' + this.elementNames().join(', #'));
  };

  Rectangle.selected = function() {
    return $filter('filter')(this.all(), {isSelected: true});
  };

  Rectangle.prototype.select = function() {
    this.isSelected = true; 
  };
  
  Rectangle.prototype.deselect = function() {
    this.isSelected = false; 
  };

  Rectangle.prototype.toggleSelected = function() {
    this.isSelected = !this.isSelected
  };

  // Positioning Getters
  // ===================

  Rectangle.prototype.top = function() {
    return parseInt(this.dndData.top, 10);
  };

  Rectangle.prototype.left = function() { 
    return parseInt(this.dndData.left, 10);
  };

  Rectangle.prototype.bottom = function() {
    return (parseInt(this.dndData.top, 10) + parseInt(this.dndData.height, 10));
  };

  Rectangle.prototype.right = function() {
    return (parseInt(this.dndData.left, 10) + parseInt(this.dndData.width, 10));
  };

  Rectangle.prototype.width = function() {
    return parseInt(this.dndData.width, 10)
  };

  Rectangle.prototype.height = function() {
    return parseInt(this.dndData.height, 10)
  };

  Rectangle.$new = function(options) {
    options || (options = {});
    var guid = options.guid || chance.guid(),
        name = options.name || chance.word();
    delete options.guid;
    delete options.name;

    return new Rectangle(angular.extend({
      name: name,
      guid: guid,

      states: [{name: 'normal' }, { name: 'hover' }],

      normal: {
        stroke: 'rgb(236, 240, 241)',
        strokeWidth: 1,
        fill: 'rgb(236, 240, 241)',
      },

      hover: {
        stroke: 'rgb(236, 240, 241)',
        strokeWidth: 1,
        fill: 'rgb(236, 240, 0)',
      },

      isSelected: false,
      isSelecting: false,
      isHighlighted: false,

      // These are the attributes controlled by the DnD module. Any other
      // attributes in this namespace will get smashed when DnD takes
      // control of the positioning.
      dndData: {
        top: chance.natural({ max: 350 }),
        left: chance.natural({ max: 350 }),
        width: chance.natural({ max: 100, min: 50 }),
        height: chance.natural({ max: 100, min: 50 })
      },
    }, options));
  };

})(drawingApp);
