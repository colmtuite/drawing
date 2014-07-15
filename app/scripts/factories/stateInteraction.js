'use strict';

(function (app) {
  var StateInteraction;

  var $factory = [
    'Model',
    function(Model) {
      StateInteraction = Model.extend(methods, angular.extend({
      }, classMethods));

      return StateInteraction;
    }];

  app.factory('StateInteraction', $factory);

  var methods = {
    toJSON: function() {
      var json = _.pick(this, 'newStateName', 'triggerVerb');

      json.actorIds = {};
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
        angular.extend(data, { actors: actors });
      }

      return data;
    },

    _unwrap: function() {
      var that = this;

      this._resource.once('value', function(snap) {
        StateInteraction.$timeout(function() {
          var data = that.parseSnapshot(snap.name(), snap.val());
          data = _.omit(data, that.associations);
          angular.extend(that, data);
          that.trigger('load');
        });
      }, this);

      this._resource.on('child_changed', function(newSnap, prevSibling) {
        StateInteraction.$timeout(function() {
          // TODO: Parse the snapshot again.
          angular.extend(that[newSnap.name()], newSnap.val());
          that.trigger('child_changed');
        });
      }, this);
    }

  };

  var classMethods = {
    triggers: [
      { name: 'click' },
      { name: 'dblclick' },
      { name: 'mouseover' },
      { name: 'mouseout' }
    ],
  };

})(drawingApp);
