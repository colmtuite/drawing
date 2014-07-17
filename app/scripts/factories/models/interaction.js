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
    onSaveSuccess: function() {
      var that = this;

      // We need to remove the actor from our internal list of actors if
      // it get's destroyed.
      this.actors.forEach(function(actor) {
        actor.once('destroy', function() {
          that.removeActor(actor);
        });
      });

      // Same for triggers.
      this.triggers.forEach(function(trigger) {
        trigger.once('destroy', function() {
          that.removeTrigger(trigger);
        });
      });
    },

    removeActor: function(actor) {
      this.actors.splice(this.actors.indexOf(actor), 1);
    },

    removeTrigger: function(trigger) {
      this.triggers.splice(this.triggers.indexOf(trigger), 1);

      // You can't have an interaction with no triggers (because there is no
      // UI for replacing a deleted trigger with a new one like there is for
      // deleted actors). Thus, if we're left with zero triggers after
      // removing one we should delete the whole interaction.
      if (this.triggers.length === 0) {
        this.destroy();
      }
    },

    toJSON: function() {
      var json = _.pick(this, 'actionVerb', 'triggerVerb');
      json.triggerIds = {};
      json.actorIds = {};

      this.triggers.forEach(function(trigger) {
        json.triggerIds[trigger.$id] = true;
      });
      
      this.actors.forEach(function(actor) {
        json.actorIds[actor.$id] = true;
      });

      return json;
    },

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
          var data = that.parseSnapshot(snap.name(), snap.val());
          data = _.omit(data, that.associations);
          angular.extend(that, data);
          that.trigger('load');
        });
      }, this);

      this._resource.on('child_changed', function(newSnap, prevSibling) {
        Interaction.$timeout(function() {
          // TODO: Parse the snapshot again.
          angular.extend(that[newSnap.name()], newSnap.val());
          that.trigger('child_changed');
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
