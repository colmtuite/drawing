'use strict';

// TODO: This filter runs like 10 times when you inspect a shape. Can't be
// efficient. Put a console.log in it and watch how many times it shows up.
// I should figure out why at some stage.
drawingApp.filter('filterTriggerIs', function() {
  return function(input, inspected) {
    if (!inspected || !input || _.isEmpty(input)) return;

    var out = [];
    for (var i = 0; i < input.length; i++) {
      // This weird method of getting the trigger $id is a result of the
      // convoluted way that we have to represent arrays in Firebase. I would
      // probaby be better off writing an Underscore extension which takes
      // a list on Firebase and turns it into an array of keys. That would
      // simplify this situation.
      if (input[i].triggerIds[0] === inspected.$id) {
        out.push(input[i]);
      }
    }
    return out;
  };
});
