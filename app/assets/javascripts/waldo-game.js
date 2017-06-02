var WALDO = WALDO || {};

WALDO.Game = (function() {
  var _start;

  var init = function() {
    console.log('Game init');
    _start = new Date();
    _showTopScorers();

  }

  var _showTopScorers = function() {
    $.getJSON('games', function(data) {
      console.log(data);
    })
  }

  return {
    init: init
  }

})();