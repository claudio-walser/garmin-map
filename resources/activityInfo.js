"use strict";

class ActivityInfo {

  constructor(selector) {
    this._selector = selector;
    $(this._selector).append('<div class="info-wrapper" id="speed-graph"></div>');
    this._chart = new SpeedChart('#speed-graph');

    this._infoMainDiv = $('<div class="info-wrapper main-info"></div>');

    this._speed = $('<span></span>');
    this._speedMax = $('<span></span>');
    this._speedWrapper = $('<div class="info-wrapper info-text"></div>');
    this._speedWrapper.append("<div class='box-title'>Speed</div>");
    this._speedWrapper.append("<span class='title'>Max </span>");
    this._speedWrapper.append(this._speedMax);
    this._speedWrapper.append('<br />');
    this._speedWrapper.append("<span class='title'>Current </span>");
    this._speedWrapper.append(this._speed);

    this._height = $('<span></span>');
    this._heightMax = $('<span></span>');
    this._heightWrapper = $('<div class="info-wrapper info-text"></div>');
    this._heightWrapper.append("<div class='box-title'>Height</div>");
    this._heightWrapper.append("<span class='title'>Max </span>");
    this._heightWrapper.append(this._heightMax);
    this._heightWrapper.append('<br />');
    this._heightWrapper.append("<span class='title'>Current </span>");
    this._heightWrapper.append(this._height);

    this._duration = $('<div></div>');
    this._durationWrapper = $('<div class="info-wrapper info-text"></div>');
    this._durationWrapper.append("<div class='box-title'>Height</div>");
    this._durationWrapper.append(this._duration);

    this._temperature = $('<div></div>');
    this._temperatureWrapper = $('<div class="info-wrapper info-text"></div>');
    this._temperatureWrapper.append("<div class='box-title'>Temperature</div>");
    this._temperatureWrapper.append(this._temperature);

    this._infoMainDiv.append(this._speedWrapper);
    this._infoMainDiv.append(this._heightWrapper);
    this._infoMainDiv.append(this._durationWrapper);
    this._infoMainDiv.append(this._temperatureWrapper);

    $(this._selector).append(this._infoMainDiv);
    $(this._selector).append('<div class="clear"></div>');

  }

  setActivity(activity) {
    this._activity = activity;
    this._speedMax.html(this.getSpeedString(this._activity.speed.max));
    this._heightMax.html(this._activity.altitude.max + ' müM');
    this._chart.setMaxSpeed(activity.speed.max);
  }

  update(currentPoint, numPoint) {
    this._duration.html(moment.utc(numPoint * 1000).format("HH:mm:ss"))
    this._temperature.html(currentPoint.temperature + '°');
    this._height.html(currentPoint.altitude + ' müM');
    this._speed.html(this.getSpeedString(currentPoint.speed));

    this._chart.setSpeedLabel(this.getSpeedInKnots(currentPoint.speed))
    this._chart.update(currentPoint.speed);
  }

  getSpeedString(ms) {
    if (this._activity.type == 'Sailing') {
      return this.getSpeedInKnots(ms);
    } else {
      return this.getSpeedInKmh(ms);
    }
  }

  getSpeedInKnots(ms) {
    return String((ms * 1.94384).toFixed(1)) + " kts";
  }

  getSpeedInKmh(ms) {
    return String((ms * 3.6).toFixed(1)) + " kmh";
  }

  getSpeedInMs(ms) {
    return String(ms) + " m/s";
  } 

}
