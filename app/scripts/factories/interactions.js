'use strict';

(function(app) {
  var data = {
    triggers: [
      { name: 'click' },
      { name: 'dblclick' },
      { name: 'mouseover' },
      { name: 'mouseout' }
    ],
    actions: [{ name: 'hide' }, { name: 'show' }, { name: 'toggle' }],
    interactions: [],
    stateInteractions: []
  };

  var randomAttributes = function(actor, actee) {
    return {
      actor: actor,
      actees: [actee],
      action: data.actions[0],
      trigger: data.triggers[0]
    };
  };

  app.factory('InteractionsFactory', function() {
    var factory = {};

    factory.triggers = function() {
      return data.triggers;
    };

    factory.actions = function() {
      return data.actions;
    };

    factory.all = function(type) {
      type || (type = 'interactions');
      return data[type];
    };

    factory.init = function(shapes) {
      if (data.interactions.length > 0) return;
      var interaction = randomAttributes(shapes[0], shapes[1]);
      data.interactions.push(interaction);
    };

    factory.create = function(attrs) {
      data.interactions.push(attrs);
    };

    factory.createState = function(attrs) {
      data.stateInteractions.push(attrs);
    };

    factory.destroy = function(interaction) {
      var index = data.interactions.indexOf(interaction)
      data.interactions.splice(index, 1);   
    };

    factory.destroyState = function(interaction) {
      var index = data.stateInteractions.indexOf(interaction)
      data.stateInteractions.splice(index, 1);   
    };

    return factory;
  });
})(drawingApp);;
