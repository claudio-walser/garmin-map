"use strict";

class Map {

  constructor(selector) {
    this._selector = selector;
    this._heatColors = [
      "#000fff",
      "#0060ff",
      "#039dfd",
      "#00f0fc",
      "#3effbe",
      "#8fff6f",
      "#cfff2f",
      "#ffdf00",
      "#ff8e01",
      "#ff3f00",
      "#fe0000"
    ];
    this._icon = 'http://maps.google.com/mapfiles/ms/micons/hiker.png';
    this._map = false;
    this._marker = false;
  }

  setUpdatePointHandler(handlerFunction) {
    this._updatePointHandler = handlerFunction;
  }

  setActivity(activity) {
    if (!activity.points || activity.points.length <= 0) {
      return;
    }

    this._marker = false;
    this.setType(activity.type);

    this._points = activity.points;
    let start = this._points[0];
    this._map = new google.maps.Map($(this._selector).get(0), {
      zoom: 13,
      center: {lat: start.lat, lng: start.lng},
      mapTypeId: 'terrain'
    });

    let speedRange = activity.speed.max / (this._heatColors.length - 1);
    let previousPoint = start;

    $.each(activity.points, function(index, point) {
      let colorIndex = Math.ceil(point.speed / speedRange);
      let color = this._heatColors[colorIndex];

      let trackCoordinates = [
        {lat: previousPoint.lat, lng: previousPoint.lng},
        {lat: point.lat, lng: point.lng}
      ];
      
      let path = new google.maps.Polyline({
        path: trackCoordinates,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      google.maps.event.addListener(path, 'click', function(h) {
        this._updatePointHandler(index);
      });

      path.setMap(this._map);       

      previousPoint = point;
    }.bind(this));
  }

  setType(type) {
    this._type = type;
    if (this._type == 'Sailing') {
      this._icon = 'http://maps.google.com/mapfiles/ms/micons/sailing.png';
    } else if (this._type == 'Wandern') {
      this._icon = 'http://maps.google.com/mapfiles/ms/micons/hiker.png';
    }    
  }

  update(point) {
    if (this._marker) {
      this._marker.setPosition({lat: point.lat, lng: point.lng});
    } else {
      this._marker = new google.maps.Marker({
        position: {lat: point.lat, lng: point.lng},
        map: this._map,
        icon: this._icon
      });
    }    
  }

}
