var WALDO = WALDO || {};

WALDO.Game = (function() {
  var _start;
  var _topScorers;
  var _topTimes;
  var _checkGameOver;
  var _timer;
  var _currentPlayer;
  var _$playerTime;
  var _saveNewHighScore;
  var _clearTags;

  var init = function(callbacks) {
    _checkGameOver = callbacks.checkGameOver;
    _saveNewHighScore = callbacks.saveNewHighScore;
    _clearTags = callbacks.clearTags;
    _$currentPlayer = $('#current-player');
    _$playerTime = $('#current-time');
    _then = new Date();
    _topTimes = [];
    _showTopScorers();
  }

  var runGame = function() {
    _timer = window.setInterval(_checkScore, 1000);
  }

  var _checkScore = function() {
    var _elapsedTime = new Date() - _then;
    if (!_checkGameOver()) {
      _elapsedTime = new Date() - _then;
      if (_elapsedTime > _topTimes[0]) {
        _$currentPlayer.before($('li[data-time="' + _topTimes.shift() + '"]'))
      }
    } else {
      window.clearInterval(_timer);
      if (!_$currentPlayer.is($('#scores li:nth-child(6)'))) {
        _saveNewHighScore(_elapsedTime);
      } else {
        alert('You\'ve found them all! Refresh the page to play again')
        _clearTags();
      }
    }
    _updatePlayerTime(_elapsedTime);
  }

  var _updatePlayerTime = function(time) {
    var time = _secondsToTime(time);
    _$playerTime.text(time.m + ':' + time.s);
  }

  var _showTopScorers = function() {
    $.getJSON('games', function(data) {
      _topScorers = data;
    }).done(function(data) {
      _populateTopScorers();
    })
  }

  var _populateTopScorers = function() {
    var list = '';
    $.each(_topScorers, function(i, game) {
      var rank = i + 2;
      var time = _secondsToTime(game.time);
      _topTimes.push(game.time);
      list += '<li data-time="' + game.time + '">' + game.name + ' ' + time.m + ':' + time.s + '</li>';
    });
    $('#scores').append(list);
  }


  var _secondsToTime = function(secs) {
    secs /= 1000;
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
      "m": _padNum(minutes),
      "s": _padNum(seconds)
    };
    return obj;
  }

  var _padNum = function(num) {
    return num < 10 ? '0' + num : num;
  }

  return {
    init: init,
    runGame: runGame
  }

})();