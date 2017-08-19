"use strict";

class ActivityInfo {

  constructor(selector) {
    this._selector = selector;
  }

  update(currentPoint) {
  	this._currentSpeed = currentSpeed;
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