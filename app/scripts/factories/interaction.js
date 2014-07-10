'use strict';

(function (app) {
  var Interaction;

  var $factory = [
    'Model',
    function(Model) {
      Interaction = Model.extend(methods, angular.extend({
      }, classMethods));

      return Interaction;
    }];

  app.factory('Interaction', $factory);

  var methods = {
    initialize: function(futureData) {
      if (!futureData) return;

      if (futureData.on) {
        this._resource = futureData;
        this._unwrap();
      } else {
        angular.extend(this, futureData);
      }
    },

    destroy: function() {
      this._resource.remove();
    },

    save: function() {
      this._resource.update(this.toJSON());
    },

    toJSON: function() {
      return angular.extend(_.pick(this, 'actionVerb', 'triggerVerb'), {
        triggerIds: this.triggerIds,
        acttorIds: this.actorIds
      });
    },

    // TODO: turn this into a passthrough and move to Model.
    parseSnapshot: function(name, val) {
      var actorIds = _.keys(val.actorIds);
      console.log("parsing", name, val, actorIds, this.rectangles);


      return angular.extend(val, {
        '$id': name,
        actorIds: _.keys(val.actorIds),
        triggerIds: _.keys(val.triggerIds),
      });
    },

    _unwrap: function() {
      var that = this;

      this._resource.once('value', function(snap) {
        Interaction.$timeout(function() {
          angular.extend(that, that.parseSnapshot(snap.name(), snap.val()));
        });
      }, this);

      this._resource.on('child_changed', function(newSnap, prevSibling) {
        Interaction.$timeout(function() {
          // TODO: Parse the snapshot again.
          angular.extend(that[newSnap.name()], newSnap.val());
        });
      }, this);
    },
  };

  var classMethods = {
    actions: [{ name: 'hide' }, { name: 'show' }, { name: 'toggle' }],

    triggers: [
      { name: 'click' },
      { name: 'dblclick' },
      { name: 'mouseover' },
      { name: 'mouseout' }
    ],

    initialAttributes: function(options) {
      if (!_.has(options, 'triggerIds') || _.isEmpty(options.triggerIds)) {
        throw "Cannot create interactin without a triggerID";
      }
          
      // The interaction occurs when when we click/mouseover/whatever 
      // the shape which is called the 'trigger'. The shapes which move or
      // change when the interaction ocurrs are called the actors. The
      // actionVerb is what the actors do when the interaction ocurrs. The 
      // triggerVerb is the thing we have to do to the trigger to kick off
      // the show.
      return angular.extend({
        actorIds: [],
        actionVerb: this.actions[0],
        triggerVerb: this.triggers[2]
      }, options);
    },
  };
}(drawingApp));
