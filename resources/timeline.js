"use strict";

class Timeline {

  constructor(selector) {
    this._selector = selector;

    this._timerStarted = false;
    this._timer = false;
  }

  setPlaySelector(selector) {
    this._playSelector = selector;
    $(this._playSelector).on('click', this.start.bind(this));
  }

  setStopSelector(selector) {
    this._stopSelector = selector;
    $(this._stopSelector).on('click', this.stop.bind(this));

  }

  setSpeedFactorSelector(selector) {
    this._speedFactorSelector = selector;
  }

  setOnChangeHandler(handlerFunction) {
    this._handlerFunction = handlerFunction;
    $(this._selector).change(this._handlerFunction);
  }

  updateMaxValue(max) {
  	$(this._selector).attr('max', max);
    $(this._selector).val(0);
    $(this._selector).trigger('change');
  }

  start() {
    if (this._timerStarted == false) {
      this._timerStarted = true;
      $(this._playSelector).hide();
      $(this._stopSelector).show();
      this.play();
    }
  }

  play() {
    if (this._timerStarted == false) {
      return;
    }

    let speed = 1000 / $(this._speedFactorSelector).val()
    let currentPos = Number($(this._selector).val());
    $(this._selector).val(currentPos + 1);
    $(this._selector).trigger("change");
    if (currentPos + 1 >= Number($(this._selector).attr("max"))) {
      this.stop();
    }
    this._timer = setTimeout(this.play.bind(this), speed);
  }

  stop() {
    this._timerStarted = false;
    clearTimeout(this._timer);
    $(this._playSelector).show();
    $(this._stopSelector).hide();
  }

}