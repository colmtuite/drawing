'use strict';

(function(app) {
  function Rectangle(data) {
    this.states = [];
    angular.extend(this, data);
  }

  Rectangle.$factory = [
    '$filter',
    'FBURL',
    '$firebase',
    function($filter, FBURL, $firebase) {
      angular.extend(Rectangle, {
        $filter: $filter,
        FBURL: FBURL,
        $firebase: $firebase
      });

      return Rectangle;
    }];

  app.factory('Rectangle', Rectangle.$factory);

  angular.extend(Rectangle.prototype, EventEmitter.prototype, {
    destroy: function() {
      this.resource().remove();
    },

    save: function() {
      this.resource().set(this.$id, this);
    },

    style: function(state) {
      state || (state = this.states[0] && this.states[0].name);
      if (state) {
        return {
          "background-color": this[state].fill,
          "border":  this[state].strokeWidth + 'px solid ' + this[state].stroke
        };
      }
    },

    previewStyle: function(state) {
      return $.extend(this.style(state), this.dndData);
    },
    
    // This method is here for consistency with the Group object. Often we
    // want to get the names of shapes which may be either groups or
    // individual shapes without type checking constantly.
    elementNames: function() {
      return [this.name];
    },

    elementIds: function() {
      return ('#' + this.elementNames().join(', #'));
    },

    select: function() {
      this.isSelected = true; 
    },
    
    deselect: function() {
      this.isSelected = false; 
    },

    toggleSelected: function() {
      this.isSelected = !this.isSelected
    },

    // Positioning Getters
    // ===================

    top: function() {
      return parseInt(this.dndData.top, 10);
    },

    left: function() { 
      return parseInt(this.dndData.left, 10);
    },

    bottom: function() {
      return (parseInt(this.dndData.top, 10) + parseInt(this.dndData.height, 10));
    },

    right: function() {
      return (parseInt(this.dndData.left, 10) + parseInt(this.dndData.width, 10));
    },

    width: function() {
      return parseInt(this.dndData.width, 10)
    },

    height: function() {
      return parseInt(this.dndData.height, 10)
    },

    // TODO: Instead of this, trigger an event whenever the $id changes and
    // update the path that way. Can also update the _resource at the same time.
    resource: function(path) {
      if (!this.$id) return;
      var ref,
          basePath = Rectangle.FBURL + 'screens/' + this.$screenId + '/rectangles' + this.$id;

      if (path) {
        ref = new Firebase(basePath + '/' + path);
        return Rectangle.$firebase(ref);
      // Only create the resource once. It won't change since the $id won't.
      } else if (!this._resource) {
        console.log("Calculating rectangle path", basePath);
        ref = new Firebase(basePath);
        this._resource = Rectangle.$firebase(ref);
      }

      return this._resource;
    },
  });

  Rectangle.selected = function() {
    return $filter('filter')(this.all(), {isSelected: true});
  };
  
  Rectangle.initialAttributes = function(options) {
    options || (options = {});
    var guid = options.guid || chance.guid(),
        name = options.name || chance.word();
    delete options.guid;
    delete options.name;

    return angular.extend({
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
    }, options)
  };

})(drawingApp);
