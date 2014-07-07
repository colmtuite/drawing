'use strict';

(function(app) {
  function Rectangle(futureData) {
    this.states = [];
    console.log("Initializing rectangle", futureData);

    if (futureData.on) {
      this._resource = futureData;
      this._unwrap();
    } else {
      angular.extend(this, futureData);
    }
  }

  Rectangle.$factory = [
    '$timeout', 
    '$filter',
    'Model',
    function($timeout, $filter, Model) {
      angular.extend(Rectangle, {
        $timeout: $timeout,
        $filter: $filter,
      });

      angular.extend(Rectangle.prototype, Model.prototype);

      return Rectangle;
    }];

  app.factory('Rectangle', Rectangle.$factory);

  angular.extend(Rectangle.prototype, {
    url: function() {
      return 'screens/' + this.$screenId + '/rectangles/' + this.$id;
    },

    destroy: function() {
      // Removing a rectangle doesn't appear to remove the item from the
      // UI on another user's screen. I've tried wrapping this line in a
      // $timeout but that doesn't appear to fix the issue. I'll have to
      // investigate what is going wrong. I suspect it's because I'm not
      // listenting to the 'value' event of the rectangle and using that
      // to remove it from the UI.
      this.resource().remove();
    },

    save: function() {
      this.resource().update(this.toJSON());
    },

    toJSON: function() {
      // Firebase appears to be very choosy about the keys of the JSON
      // you send to the server. Might be worth having a look at the AngularFire
      // toJSON implementation to try and get a better way to pick out keys
      // which are going to cause trouble.
      return _.pick(this, 'dndData', 'name', 'guid', 'normal', 'hover', 'isSelected', 'isSelecting', 'isHighlighted');
    },

    _unwrap: function() {
      this.resource().once('value', function(snap) {
        // console.log("Rect value change", snap.val());
        this.$id = snap.name();
        angular.extend(this, snap.val());
      }, this);

      this.resource().on('value', function(snap) {
        console.log("Rectangle value", snap.name(), snap.val());
        var that = this;
        Rectangle.$timeout(function() {
          if (snap.val() === null) {
            // The rectangle has been deleted. 
            // TODO: http://stackoverflow.com/q/14250642/574190
          } else {
            angular.extend(that[newSnap.name()], newSnap.val());
          }
        });
      }, this);

      // this.resource().on('child_changed', function(newSnap, prevSibling) {
      //   console.log("Rect child changed", newSnap.name(), newSnap.val());
      //   var that = this;
      //   // Only applying changes if they have no children is not sophisticated
      //   // enough in this instance because rectangle data contains some nested
      //   // structures like states which, when changed, we want to update the
      //   // whole rectangle. For example, "fill" is nested under "normal" so
      //   // when ""fill" is changed the snapshot sent looks like this:
      //   //
      //   //   snap.name() -> normal
      //   //   snap.val() -> { fill: '...', stroke: '...', strokeWidth: 2 }
      //   //   snap.hasChildren() -> true
      //   //
      //   // The difference between Rectangle and Screen in this instance is
      //   // that Rectanlge has no children which are proper models in this
      //   // system. Thus, I can skip the hasChildren test.
      //   Rectangle.$timeout(function() {
      //     angular.extend(that[newSnap.name()], newSnap.val());
      //   });
      // }, this);
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
