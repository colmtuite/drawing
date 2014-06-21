drawingApp.filter('filterActorIs', function() {
  return function(input, selected) {
    var out = [];
    for (var i = 0; i < input.length; i++) {
      if (input[i].actor === selected) {
        out.push(input[i]);
      }
    }
    return out;
  };
});
