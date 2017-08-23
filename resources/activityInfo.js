"use strict";

class ActivityInfo {

  constructor(selector) {
    this._selector = selector;
  }

  setActivity(activity) {
    this._activity = activity;
    $("#speed-max").html(this.getSpeedString(this._activity.speed.max));
    $("#altitude-max").html(this._activity.altitude.max + 'müM');
  }

  update(currentPoint, numPoint) {
    $("#duration").html(moment.utc(numPoint * 1000).format("HH:mm:ss"))
    $("#temperature").html(currentPoint.temperature + '°');
    $("#altitude").html(currentPoint.altitude + 'müM');

    $("#speed").html(this.getSpeedString(currentPoint.speed));
  }

  getSpeedString(ms) {
    let speedString = (ms * 1.94384).toFixed(1) + " kts | " +
    (ms * 3.6).toFixed(1) + " kmh | " +
    + ms + " m/s";

    return speedString;
  }

}


// function changePoint(point) {
//   var dd = new Date(point.datetime)
//   var d = Date.parse(point.datetime);
//   speedString = (point.speed * 1.94384).toFixed(1) + " kts | " +
//           (point.speed * 3.6).toFixed(1) + " kmh | " +
//           + point.speed + " m/s";
//   $('#speed').html(speedString);
//   $('#temperature').html(point.temperature);
//   $('#datetime').html(point.datetime);
// }