'use strict';

// TODO: This filter runs like 10 times when you inspect a shape. Can't be
// efficient. Put a console.log in it and watch how many times it shows up.
// I should figure out why at some stage.
drawingApp.filter('filterTriggerIs', function() {
  return function(input, inspected) {
    if (!inspected || !input || _.isEmpty(input)) return;

    var out = [];
    for (var i = 0; i < input.length; i++) {
      // Currently I'm just pretending that there can only be one trigger
      // to simplify the UI.
      if (input[i].triggers && input[i].triggers[0] === inspected) {
        out.push(input[i]);
      }
    }
    return out;
  };
});
