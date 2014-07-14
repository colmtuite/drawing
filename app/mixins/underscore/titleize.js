_.mixin({
  titleize: function(str) {
    var words = str.split(' '),
        array = [];

    for (var i = 0; i < words.length; ++i) {
      array.push(words[i].charAt(0).toUpperCase() + words[i].slice(1));
    }

    return array.join(' ');
  },

  classify: function(str) {
    str = str.replace(/s$/, '');
    return this.titleize(str);
  }
});
