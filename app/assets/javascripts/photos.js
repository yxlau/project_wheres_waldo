var WALDO = WALDO || {};

WALDO.Main = (function(Game) {
  var _tags;
  var _$tagger;
  var _$taggerFrame;
  var _characterList;
  var _taggerVisible;
  var _hoveringOnTag;
  var _imgWidth;
  var _imgHeight;

  var init = function() {
    _hoveringOnTag = false;
    _taggerVisible = false;
    _characterList = {};
    _imgWidth = $('.waldo').width();
    _imgHeight = $('.waldo').height();
    _imgOffset = $('.waldo').offset();

    _setContainerWidth();
    _getNames();
    _setUpExistingTags();
    _setUpListeners();
    _listenForResize();

    Game.init({
      checkGameOver: _checkGameOver,
      saveNewHighScore: _saveNewHighScore,
      clearTags: _clearTags
    });

  }

  var _setUpListeners = function() {
    _$tags = $('.tagged');
    _listenForTagging();
    _listenForPhotoHover();
    _listenForTagRemoval();
  }

  var _listenForResize = function() {
    $(window).resize(function() {
      _$tags.remove();
      _imgOffset = $('.waldo').offset();
      $.each(_tags, function(i, tag) {
        _createDroppedTag(tag);
      });
      _setUpListeners();
    });
  }

  var _setContainerWidth = function() {
    $('#img').width($('.waldo').width());
  }

  var _setUpExistingTags = function() {
    $.getJSON('/tags', function(data) {
      _tags = data;
    }).done(function(data) {
      if (_tags.length > 0) {

        $.each(data, function(i, tag) {
          _createDroppedTag(tag);
        });
      }

      _setUpListeners();

    });
  }

  var _checkGameOver = function() {
    return $.isEmptyObject(_characterList);
  }

  var _saveNewHighScore = function(time) {
    var name = prompt('Wow. New high score! Congrats. Pease enter you name');
    $.ajax({
      url: '/games',
      method: 'POST',
      data: {
        games: {
          name: name,
          time: time
        }
      },
      dataType: 'json',
      success: function() {
        alert('Thanks! Your high score has been saved');
        _clearTags();
      },
      error: function() {
        console.log('Score not saved');
      }
    })
  }

  var _clearTags = function() {
    console.log('_tags', _$tags);

    var tags = []
    $.each(_$tags, function(i, tag) {
      tags.push($(tag).find('.tag-close').data('tag-id'));
    });
    $.ajax({
      url: 'tags/' + JSON.stringify(tags),
      method: 'DELETE',
      dataType: 'json',
      data: {
        tag_ids: tags
      },
      success: function() {
        console.log('Tags successfully cleared');
      },
      error: function() {
        console.log('Tags could not be destroyed');
      }
    })
  }

  var _createDroppedTag = function(tag) {
    var $tag = $('<div>').addClass('tagged')
      .css({
        position: 'absolute',
        left: _percentToPx(tag.x, _imgWidth) + _imgOffset.left,
        top: _percentToPx(tag.y, _imgHeight) + _imgOffset.top,
      })
      .html(
        _createCloseButton(tag.id, tag.character.name, tag.character_id)
      )
      .hide();
    $('#img').append($tag);
  }

  var _pxToPercent = function(px, img) {
    return px / img * 100;
  }

  var _percentToPx = function(pc, img) {
    return pc / 100 * img;
  }


  var _getNames = function() {
    //[ {id, name}, {}, ...]
    $.getJSON('characters', function(data) {
      console.log(data);
      $.each(data, function(i, character) {
          _characterList[character.id] = character.name;
        })
        // _characterList = data;
    }).done(function() {
      _createTagger();
      Game.runGame();
    })
  }


  var _listenForPhotoHover = function() {
    $('#img').on('mouseenter', function() {
      _$tags.fadeIn();
    });
    $('#img').on('mouseleave', function() {
      _$tags.fadeOut();
    })
  }


  var _listenForTagging = function() {
    $('#img').on('click', function(e) {
      // get current x and y coordinates:
      e.stopImmediatePropagation();
      var x = e.clientX;
      var y = e.clientY;
      _toggleTagger(x, y);
    })
  }

  var _toggleTagger = function(x, y) {
    _$tagger.css({
      left: x - _$taggerFrame.width() / 2,
      top: y - _$taggerFrame.height() / 2
    });

    if (!_taggerVisible) {
      _$tagger.fadeIn();
      _listenForNameSelection();

    } else {
      _$tagger.hide();
    }

    _taggerVisible = _taggerVisible ? false : true;

  }

  var _listenForNameSelection = function() {
    $('#tagger').on('click', 'li', function(e) {
      e.stopImmediatePropagation();
      var $this = $(this);
      _createTagRecord($this);
    });
  }

  var _dropTag = function(tag_id, name, char_id) {
    _$tagger.html(
      _createCloseButton(tag_id, name, char_id)
    );
    _$tagger.attr('id', null).addClass('tagged');
  }

  var _createCloseButton = function(tag_id, name, char_id) {
    return '<div class="tag-frame"></div>' +
      '<div class="tag-name">' + name + '</div>' +
      '<div class="tag-close" data-tag-id="' + tag_id + '" data-tag-name="' + name + '" data-char-id="' + char_id + '"> X </div>';
  }

  var _createTagRecord = function($that) {
    var tagData = {
      tag: {
        character_id: $that.data('char-id'),
        x: _pxToPercent(_$tagger.position().left - _imgOffset.left, _imgWidth),
        y: _pxToPercent(_$tagger.position().top - _imgOffset.top, _imgHeight)
      }
    }

    $.ajax({
      url: 'tags',
      method: 'POST',
      dataType: 'json',
      data: tagData,
      success: function(data) {
        console.log('Tag created');
        _dropTag(data.id, $that.text(), $that.data('char-id'));
        _removeNameFromNameList($that.data('char-id'), $that.text());
        _listenForTagRemoval();
        _setUpListeners();
        _createTagger();
        _taggerVisible = false;

      },
      error: function(jqxhr, status, error) {
        console.log('Could not create tag');
        console.log(jqxhr, status, error)
      }
    })

  }

  var _listenForTagRemoval = function() {
    $('.tag-close').on('click', function(e) {
      e.stopImmediatePropagation();
      _destroyTagRecord($(this));
    })
  }

  var _destroyTagRecord = function($this) {

    $.ajax({
      url: '/tags/' + $this.data('tag-id'),
      type: 'DELETE',
      dataType: 'json',
      success: function(data) {
        console.log('Tag destroyed');
        _addNameToNameList($this.data('char-id'), $this.data('tag-name'));
        $this.parent().remove();
      },
      error: function(jqxhr, status, error) {
        console.log('Could not destroy tag')
      }
    })
  }

  var _addNameToNameList = function(id, name) {
    _characterList[id] = name;
    _refreshTaggerNames();
  }

  var _refreshTaggerNames = function() {
    var names = '';
    $.each(_characterList, function(id, name) {
      names += '<li data-char-id="' + id + '">' + name + '</li>';
    });
    _$tagger.find('.namelist').html(names);
  }

  var _removeNameFromNameList = function(id, name) {
    delete _characterList[id];
  }


  var _createTagger = function() {
    _$tagger = $('<div>').attr({
        id: 'tagger',
      })
      .css({
        position: 'absolute'
      });

    _$taggerFrame = $('<div>').addClass('tag-frame')

    var $nameList = $('<ul>').addClass('namelist')
    var names = '';
    $.each(_characterList, function(id, name) {
      names += '<li data-char-id="' + id + '">' + name + '</li>';
    })
    $nameList.html($(names));

    _$tagger.append(_$taggerFrame).append($nameList).hide();

    $('#img').append(_$tagger);
  }




  return {
    init: init
  }

})(WALDO.Game);

$(document).ready(function() {
  WALDO.Main.init();
})