var WALDO = WALDO || {};

WALDO.Main = (function() {
  var _tags;
  var _$tagger;
  var _$taggerFrame;
  var _nameList;
  var _taggerVisible;

  var init = function() {
    _taggerVisible = false;
    _setUpListeners();
    _getNames();
    _createTagger();
  }

  var _setUpListeners = function() {
    _$tags = $('.tag');
    _listenForTagging();
    _listenForPhotoHover();
  }

  var _getNames = function() {
    // this will probably turn into an ajax call later?
    _nameList = ['Jake', 'Amy', 'Rosa', 'Holt', 'Terry', 'Boyle', 'Gina'];
  }


  var _listenForPhotoHover = function() {
    $('img').on('mouseenter', function() {
      _displayTags();
    })
  }

  var _displayTags = function() {
    // update tags first? use getTags?
    _$tags.delay(1000).fadeIn(1000);
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
      // a name has been clicked on
      // 1. 
      var $this = $(this);

      _dropTag($this.text());
      _listenForTagRemoval();

      _removeNameFromNameList($this.data('name-id'));
      _createTagger();
      _taggerVisible = false;

    })
  }

  var _dropTag = function(name) {
    _$tagger.html(
      '<div class="tag-frame"></div>' +
      '<div class="tag-name">' + name + '</div>' +
      '<div class="tag-close">X</div>'
    );
    _$tagger.attr('id', null).addClass('tagged');
  }

  var _listenForTagRemoval = function() {
    // make this use IDs later on
    // traversing the DOM is not good
    $('.tag-close').on('click', function(e) {
      e.stopImmediatePropagation();
      var name = $(this).siblings('.tag-name').text();
      _addNameToNameList(name);
      $(this).parent().remove();
    })
  }

  var _addNameToNameList = function(name) {
    _nameList.push(name);
    _refreshTaggerNames();
  }

  var _refreshTaggerNames = function() {
    var names = '';
    $.each(_nameList, function(i, name) {
      names += '<li data-name-id="' + i + '">' + name + '</li>';
    });
    _$tagger.find('.namelist').html(names);
  }

  var _removeNameFromNameList = function(id) {
    _nameList.splice(id, 1);
  }

  var _createTagger = function() {
    _$tagger = $('<div>').attr({
        id: 'tagger',
        // 'data-tagging': 'active'
      })
      .css({
        position: 'absolute'
      });


    _$taggerFrame = $('<div>').addClass('tag-frame')

    var $nameList = $('<ul>').addClass('namelist')
    var names = '';
    $.each(_nameList, function(i, name) {
      names += '<li data-name-id="' + i + '">' + name + '</li>';
    })
    $nameList.html($(names));

    _$tagger.append(_$taggerFrame).append($nameList).hide();

    $('body').append(_$tagger);
  }




  return {
    init: init
  }

})();

$(document).ready(function() {
  WALDO.Main.init();
})