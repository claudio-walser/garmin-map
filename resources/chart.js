class SpeedChart {
  constructor(selector) {
    this._selector = selector;
  }

  setPoints(points) {
    this._points = points;
  }

  update(currentSpeed) {
  	this._currentSpeed = currentSpeed;
  }

  render() {

  }
}