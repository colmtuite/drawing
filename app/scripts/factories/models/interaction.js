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

      console.log("Interaction.toJSON()", this.actors);

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
