"use strict";

class ActivityInfo {

  constructor(selector) {
    this._selector = selector;
    this._chart = new SpeedChart();
  }

  setActivity(activity) {
    this._activity = activity;
    $("#speed-max").html(this.getSpeedString(this._activity.speed.max));
    $("#altitude-max").html(this._activity.altitude.max + 'müM');

    this._chart.setMaxSpeed(activity.speed.max);
  }

  update(currentPoint, numPoint) {
    $("#duration").html(moment.utc(numPoint * 1000).format("HH:mm:ss"))
    $("#temperature").html(currentPoint.temperature + '°');
    $("#altitude").html(currentPoint.altitude + 'müM');
    $("#speed").html(this.getSpeedString(currentPoint.speed));
    this._chart.setSpeedLabel(this.getSpeedInKnots(currentPoint.speed))
    this._chart.update(currentPoint.speed);
  }

  getSpeedString(ms) {
    let speedString = this.getSpeedInKnots(ms) + " | " +
    this.getSpeedInKmh(ms) + " | " +
    this.getSpeedInMs(ms);

    return speedString;
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


// function changePoint(point) {
//   var dd = new Date(point.datetime)
//   var d = Date.parse(point.datetime);
//   speedString = (point.speed * 1.94384).toFixed(1) + " kts | " +
//           (point.speed * 3.6).toFixed(1) + " kmh | " +
//           + point.speed + " m/s";
//   $('#speed').html(speedString);
//   $('#temperature').html(point.temperature);
//   $('#datetime').html(point.datetime);
// }