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

    toJSON: function() {
      var triggerIds = {};
      this.triggers.forEach(function(trigger) {
        triggerIds[trigger.$id] = true;
      });
      
      var actorIds = {};
      this.actors.forEach(function(actor) {
        actorIds[actor.$id] = true;
      });

      return angular.extend(_.pick(this, 'actionVerb', 'triggerVerb'), {
        triggerIds: triggerIds,
        actorIds: actorIds
      });
    },

    // TODO: move to Model and override.
    parseSnapshot: function(name, val) {
      var data = angular.extend(val, { '$id': name });

      if (this.collection.rectangles) {
        var that = this;
        var actors = _.keys(val.actorIds).map(function(id) {
          return that.collection.rectangles.get(id);
        });
        var triggers = _.keys(val.triggerIds).map(function(id) {
          return that.collection.rectangles.get(id);
        });
        angular.extend(data, { actors: actors, triggers: triggers });
      }

      return data;
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
      if (!_.has(options, 'triggers') || _.isEmpty(options.triggers)) {
        throw "Cannot create interactin without triggers";
      }
          
      // The interaction occurs when when we click/mouseover/whatever 
      // the shape which is called the 'trigger'. The shapes which move or
      // change when the interaction ocurrs are called the actors. The
      // actionVerb is what the actors do when the interaction ocurrs. The 
      // triggerVerb is the thing we have to do to the trigger to kick off
      // the show.
      return angular.extend({
        actors: [],
        actionVerb: this.actions[0],
        triggerVerb: this.triggers[2]
      }, options);
    },
  };
}(drawingApp));
