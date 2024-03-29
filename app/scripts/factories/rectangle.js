'use strict';

(function(app) {
  var Rectangle;

  var $factory = [
    'Model',
    function(Model) {
      Rectangle = Model.extend(methods, angular.extend({
      }, classMethods));

      return Rectangle;
    }];

  app.factory('Rectangle', $factory);

  var methods = {
    initializeAssociations: function() {
      this.states = [];
    },

    toJSON: function() {
      // Firebase appears to be very choosy about the keys of the JSON
      // you send to the server. Might be worth having a look at the AngularFire
      // toJSON implementation to try and get a better way to pick out keys
      // which are going to cause trouble.
      return _.pick(this, 'dndData', 'name', 'guid', 'normal', 'hover', 'isSelected', 'isSelecting', 'isHighlighted');
    },

    _unwrap: function() {
      var that = this;

      this._resource.once('value', function(snap) {
        Rectangle.$timeout(function() {
          var data = that.parseSnapshot(snap.name(), snap.val());
          data = _.omit(data, that.associations);
          angular.extend(that, data);
          that.trigger('load');
        });
      }, this);

      this._resource.on('child_changed', function(newSnap, prevSibling) {
        // Only applying changes if they have no children is not sophisticated
        // enough in this instance because rectangle data contains some nested
        // structures like states which, when changed, we want to update the
        // whole rectangle. For example, "fill" is nested under "normal" so
        // when ""fill" is changed the snapshot sent looks like this:
        //
        //   snap.name() -> normal
        //   snap.val() -> { fill: '...', stroke: '...', strokeWidth: 2 }
        //   snap.hasChildren() -> true
        //
        // The difference between Rectangle and Screen in this instance is
        // that Rectanlge has no children which are proper models in this
        // system. Thus, I can skip the hasChildren test.
        Rectangle.$timeout(function() {
          angular.extend(that[newSnap.name()], newSnap.val());
          that.trigger('child_changed');
        });
      }, this);
    },

    style: function(state) {
      state || (state = this.states[0] && this.states[0].name);
      // Angular seems to call this function way before the states have been
      // initilaized when it is preparing the page. For that reason, we have
      // to be able to handle the case where this.states is undefined.
      if (state) {
        return {
          "background-color": this[state].fill,
          "border":  this[state].strokeWidth + 'px solid ' + this[state].stroke
        };
      } else {
        return {};
      }
    },

    previewStyle: function(state) {
      return angular.extend(this.style(state), this.dndData);
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

    highlight: function() { this.isHighlighted = true; },
    unhighlight: function() { this.isHighlighted = false; },

    toggleHighlighted: function() { this.isHighlighted = !this.isHighlighted },

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
  };

  var classMethods = {
    initialAttributes: function(options) {
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
    }
  };

})(drawingApp);
