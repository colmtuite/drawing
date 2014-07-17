'use strict';

(function(app) {
  var Rectangle;

  var $factory = [
    'Model',
    function(Model) {
      Rectangle = Model.extend(methods, classMethods);
      return Rectangle;
    }];

  app.factory('Rectangle', $factory);

  var methods = {
    initializeAssociations: function() {
      this.states = { normal: {} };
    },

    toJSON: function() {
      // Firebase appears to be very choosy about the keys of the JSON
      // you send to the server. Might be worth having a look at the AngularFire
      // toJSON implementation to try and get a better way to pick out keys
      // which are going to cause trouble.
      return _.pick(this, 'dndData', 'name', 'guid', 'states');
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

    // Ranem to stateName and state.
    style: function(stateName) {
      // NOTE: Do not try to infer this by doing _.keys(this.states)[0]. We
      // can never be sure of the order the keys will arrive in.
      stateName || (stateName = 'normal');
      // Angular seems to call this function way before the states have been
      // initilaized when it is preparing the page. For that reason, we have
      // to be able to handle the case where this.states is undefined.
      if (!stateName) return {};

      var state = this.states[stateName];

      return {
        "background-color": state.fill,
        "border":  state.strokeWidth + 'px solid ' + state.stroke,
        "opacity": state.opacity,
        "border-radius": state.borderRadius
      };
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

    select: function() { this.isSelected = true; },
    deselect: function() { this.isSelected = false; },
    toggleSelected: function() { this.isSelected = !this.isSelected },

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

        // There's a number of issues with making this an array rather than
        // an object. 
        //
        // Firstly, when it get's sent to Firebase it needs to be
        // stored as an object rather than an array (because of this:
        // http://goo.gl/a1zMlu ). Initially I thought this would simply
        // involve converting it to an object in the toJSON method and back
        // to an array in the parseSnapshot method. That would mean using the
        // push() method to create unique ID's for each state before saving
        // them to the DB. I don't really understand how I can do that
        // without creating complicated objects for each state (perhaps a
        // dedicated State model like I have for Rectangle).
        //
        // One thing I could do is simply convert it to an object which is
        // keyed with the names of each state. i.e., in the toJSON method
        // I would just convert the array of states from this:
        //
        // [{ name: 'normal', stroke: '..' }, { name: 'hover', stroke: '..' }]
        //
        // into an object which looks like this:
        //
        // { normal: { stroke: '..' }, hover: { stroke: '..' } }
        //
        // I'm not sure there would be any point though. This wouldn't actually 
        // solve any of the problems that they list in their docs. The thing
        // is, I'm not sure it's important that I actually address those
        // problems. I don't really care about clashes with renaming states
        // (at least at the moment, I can always sort it out later). Thus,
        // I might as well just straight up save the array and let the keys
        // be indexed strings.
        //
        // One thing I've learned though is that I should just comment out
        // the code rather than delete it because I've changed my mind about
        // this so many times already.
        //
        // The other problem relates to making AngularSelectize work with
        // objects.

        states: {
          normal: {
            stroke: 'rgb(236, 240, 241)',
            strokeWidth: 1,
            fill: 'rgb(236, 240, 241)',
            opacity: 1,
            borderRadius: 0
          },
          hover: {
            stroke: 'rgb(236, 240, 241)',
            strokeWidth: 1,
            fill: 'rgb(236, 240, 0)',
            opacity: 1,
            borderRadius: 0
          },
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
