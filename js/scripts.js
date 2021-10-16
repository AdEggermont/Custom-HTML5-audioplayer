$(document).ready(function() {
  var duration;
  var $audio = $('#sample');
  var audio = $audio[0];
  var $audioPlayer = $('.audio-player');
  var $audioButton = $('.audio-button');
  var $playhead = $('.playhead');
  var $timeline = $('.timeline')[0];
  var timelineWidth = $timeline.offsetWidth;
  var $currentTime = $('.current-time');
  var $totalTime = $('.total-time');

  /*
    Play/pause button
  */

  $audioButton.on('click', function(e) {
    e.preventDefault();

    if($audioPlayer.hasClass('playing')) {
      $audio.trigger('pause');
    } else {
      $audio.trigger('play');
    }
  });

  audio.addEventListener("playing", playing, false);
  audio.addEventListener("pause", paused, false);

  function playing() {
    $('.to-pause1')[0].beginElement();
    $('.to-pause2')[0].beginElement();

    $audioPlayer.addClass('playing');
  }

  function paused() {
    $('.to-play1')[0].beginElement();
    $('.to-play2')[0].beginElement();

    $audioPlayer.removeClass('playing');
  }

  /*
    Set music duration
  */

  setTotalTime();

  audio.onloadedmetadata = function() {
    setTotalTime();
  };

  function setTotalTime() {
    duration = audio.duration;
    $totalTime.html(sToTime(duration));
  }

  /*
    Update played time
  */

  audio.addEventListener("timeupdate", timeUpdate, false);

  function timeUpdate() {
    var playPercent = 100 * (audio.currentTime / duration);
    $playhead.css({ 'left' : playPercent + '%' });

    $currentTime.html(sToTime(audio.currentTime));
  }

  /*
    Make playhead interactable
  */

  var mouseDown = false;

  $playhead.on('mousedown', function() {
    mouseDown = true;
  });

  $(document).on('mouseup', function() {
    mouseDown = false;
  });

  $(document).on('mousemove', function(event) {
    if(mouseDown) {
      var newMargLeft = event.clientX - getPosition($timeline);

      if (newMargLeft != 0 && newMargLeft != timelineWidth) {
        $playhead.css({ 'left' : newMargLeft + 'px' });
        audio.currentTime = duration * clickPercent(event.clientX);
      }
      if (newMargLeft <= 0) {
        $playhead.css({ 'left' : '0' });
        audio.currentTime = 0;
      }
      if (newMargLeft >= timelineWidth) {
        $playhead.css({ 'left' : timelineWidth + 'px' });
        audio.currentTime = duration;
      }
    }
  });

  /*
    Functions
  */

  function clickPercent(clientX) {
    return (clientX - getPosition($timeline)) / timelineWidth;
  }

  function getPosition(el) {
		return el.getBoundingClientRect().left;
	}

	function sToTime(t) {
		return padZero(parseInt((t / (60 * 60)) % 24)) + ":" +
					 padZero(parseInt((t / (60)) % 60)) + ":" +
					 padZero(parseInt((t) % 60));
	}

	function padZero(v) {
		return (v < 10) ? "0" + v : v;
	}
});


