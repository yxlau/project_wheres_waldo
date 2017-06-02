var WALDO = WALDO || {};

WALDO.Main = (function() {
  var _tags;
  var _$tagger;
  var _$taggerFrame;
  var _characterList;
  var _taggerVisible;
  var _hoveringOnTag;

  var init = function() {
    _hoveringOnTag = false;
    _taggerVisible = false;
    _characterList = {};

    _setContainerWidth();
    _getNames();
    _setUpExistingTags();
    _setUpListeners();
    _listenForTagging();
  }

  var _setUpListeners = function() {
    _$tags = $('.tagged');
    _listenForPhotoHover();
    _listenForTagRemoval();
  }


  var _setContainerWidth = function() {
    $('#img').width($('#img').children('img').width());
  }

  var _setUpExistingTags = function() {
    $.getJSON('/tags', function(data) {
      _tags = data;
    }).done(function(data) {

      $.each(data, function(i, tag) {
        var $tag = $('<div>').addClass('tagged')
          .css({
            position: 'absolute',
            left: tag.x,
            top: tag.y,
          })
          .html(
            '<div class="tag-frame"></div>' +
            '<div class="tag-name">' + tag.character.name + '</div>' +
            '<div class="tag-close" data-tag-id="' + tag.id + '" data-tag-name="' + tag.character.name + '"> X </div>'
          )
          .hide();
        $('#img').append($tag);
      });

      _setUpListeners();
    });
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
    })
  }


  var _listenForPhotoHover = function() {
    $('#img').on('mouseenter', function() {
      $(this).children('.tagged').fadeIn();
    });
    $('#img').on('mouseleave', function() {
      $(this).children('.tagged').fadeOut();
    })

  }

  var _displayTags = function(e) {
    // update tags first? use getTags?
    e.stopImmediatePropagation();

    _$tags.fadeToggle()


  }

  var _listenForTagging = function() {
    $('img').on('click', function(e) {
      console.log('image clicked');
      // get current x and y coordinates:
      var x = e.clientX;
      var y = e.clientY;
      _toggleTagger(x, y);
    })
  }

  var _toggleTagger = function(x, y) {
    console.log('_toggleTagger');
    _$tagger.css({
      left: x - _$taggerFrame.width() / 2,
      top: y - _$taggerFrame.height() / 2
    });

    console.log('tagger visibility', _taggerVisible);
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
      var $this = $(this);
      _createTagRecord($this);
    });
  }

  var _dropTag = function(name) {
    _$tagger.html(
      '<div class="tag-frame"></div>' +
      '<div class="tag-name">' + name + '</div>' +
      '<div class="tag-close">X</div>'
    );
    _$tagger.attr('id', null).addClass('tagged');
  }

  var _createTagRecord = function($that) {
    var tagData = {
      tag: {
        character_id: $that.data('char-id'),
        x: _$tagger.position().left,
        y: _$tagger.position().top
      }
    }

    $.ajax({
      url: 'tags',
      method: 'POST',
      dataType: 'json',
      data: tagData,
      success: function(data) {
        console.log('success');
        _dropTag($that.text());
        _removeNameFromNameList($that.data('char-id'), $that.text());
        _listenForTagRemoval();
        _createTagger();
        _taggerVisible = false;

      },
      error: function(jqxhr, status, error) {
        console.log('error');
        console.log(jqxhr, status, error)
      }
    })

  }

  var _listenForTagRemoval = function() {
    // make this use IDs later on
    // traversing the DOM is not good
    $('.tag-close').on('click', function(e) {
      e.stopImmediatePropagation();
      var id = $(this).data('tag-id');
      var name = $(this).data('tag-name');
      _destroyTagRecord(id, name);
      $(this).parent().remove();
    })
  }

  var _destroyTagRecord = function(id, name) {

    $.ajax({
      url: '/tags/' + id,
      type: 'DELETE',
      dataType: 'json',
      success: function() {
        console.log('Tag destroyed');
        _addNameToNameList(id, name);
      },
      error: function(jqxhr, status, error) {
        console.log(error);
        console.log('Could not destroy tag')
      }
    })

  }

  var _addNameToNameList = function(id, name) {
    _characterList[id] = name;
    _refreshTaggerNames();
    console.log(_characterList);

  }

  var _refreshTaggerNames = function() {
    var names = '';
    $.each(_characterList, function(id, name) {
      names += '<li data-char-id="' + id + '">' + name + '</li>';
    });
    _$tagger.find('.namelist').html(names);
  }

  var _removeNameFromNameList = function(id, name) {
    console.log('character list', _characterList);
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

})();

$(document).ready(function() {
  WALDO.Main.init();
})