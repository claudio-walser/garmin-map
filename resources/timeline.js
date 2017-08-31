"use strict";

class Timeline {

  constructor(selector) {

    console.log('timeline');
    this._selector = selector;

    this._timerStarted = false;
    this._timer = false;

    this._playButton = $('<input type="button" value="Play" />');
    this._playButton.on('click', this.start.bind(this));

    this._stopButton = $('<input type="button" value="Stop" />');
    this._stopButton.on('click', this.stop.bind(this));

    this._speedFactor = $('<input type="text" value="5" />');

    this._timeline = $('<input type="range" min="0" max="100" value="0" />');
    let timelineDiv = $('<div></div>');
    timelineDiv.append(this._timeline);

    $(this._selector).append(this._playButton);
    $(this._selector).append(this._stopButton);
    $(this._selector).append(this._speedFactor);
    $(this._selector).append(timelineDiv);
  }

  setOnChangeHandler(handlerFunction) {
    this._handlerFunction = handlerFunction;
    this._timeline.change(this._handlerFunction);
  }

  updateMaxValue(max) {
  	this._timeline.attr('max', max);
    this._timeline.val(0);
    this._timeline.trigger('change');
    $(this._selector).show();
  }

  start() {
    if (this._timerStarted == false) {
      this._timerStarted = true;
      this._playButton.hide();
      this._stopButton.show();
      this.play();
    }
  }

  play() {
    if (this._timerStarted == false) {
      return;
    }

    let speed = 1000 / this._speedFactor.val()
    let currentPos = Number(this._timeline.val());
    this._timeline.val(currentPos + 1);
    this._timeline.trigger("change");
    if (currentPos + 1 >= Number(this._timeline.attr("max"))) {
      this.stop();
    }
    this._timer = setTimeout(this.play.bind(this), speed);
  }

  stop() {
    this._timerStarted = false;
    clearTimeout(this._timer);
    this._playButton.show();
    this._stopButton.hide();
  }

}