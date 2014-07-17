'use strict';

// This filter runs like 10 times when you inspect a shape. It looks
// like this is normal and ok: http://stackoverflow.com/a/11677377/574190
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
