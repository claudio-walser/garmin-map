<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>Garmin Speed Map</title>
    <style>
      #map {
        height: 100%;
      }
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      #body {
        width: 80%;
        height: 100%;
        margin: auto;
        position: relative;
      }
      /*
      #info-overlay {
        width: 100%;
        display: block;
        z-index: 9999999;
        top: 0;
        background: rgba(255,255,255,0.7);
        padding-bottom: 20px;
      }

      .wrapper {
        margin: 10px;
      }
      .twrapper {
        text-align: center;
      }
*/
      #timeline {
        width: 100%;
        margin: auto;
        margin-top: 35px;
      }
/*      .tooltiptext {
        width: 120px;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 5px 0;
        border-radius: 6px;
     
        position: absolute;
        z-index: 1;
    }*/


.tooltiptext { 
  position: absolute;
  background-color: black;
  width: 120px; 
  height: 30px;
  top: 65px;
  text-align: center; 
  color: white; 
  border-radius: 10px; 
  display: inline-block; 
  font: bold 15px/30px Georgia;
  left: 0;
  margin-left: -1%;
}
.tooltiptext:after { 
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-top: 10px solid #000000;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  margin-top: -1px;
}



    </style>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  </head>
  <body>

  <div id="body">
    <div id="info-overlay">
      <div class="wrapper">Aktivitätsauswahl: <select id="activity" name="activity"></select></div>
      <div class="wrapper">Geschwindigkeit: <span id="speed"></span></div>
      <div class="wrapper">Datum und Zeit: <span id="datetime"></span></div>
      <div class="wrapper">Temperatur: <span id="temperature"></span></div>

      <div class="twrapper">
        <input id="speed-factor" type="text" value="5" />
        <input id="play" type="button" value="Play" />
        <input id="play-stop" type="button" value="Stop" />
        <input name="timeline" id="timeline" type="range" min="0" max="100" value="0" />
        <!-- <div class="tooltiptext">Tooltip text</div> -->
      </div>
    </div>
    <div id="map"></div>
    <script>
      var currentPoints = null;
      var map = null;
      var marker = null;
      var currentIcon = false;
      var timer = false;
      var timerStarted = false;

      function play() {
        if (timerStarted == false) {
          return;
        }

        speed = 1000 / $("#speed-factor").val()
        currentPos = Number($("#timeline").val());
        $("#timeline").val(currentPos + 1);
        $("#timeline").trigger("change");
        if (currentPos + 1 == Number($("#timeline").attr("max"))) {
          stop();
        }
        timer = setTimeout(function(){ play() }, speed);
      }

      function start() {
          if (timerStarted == false) {
            timerStarted = true;
            play();
          }
      }

      function stop() {
          console.log("stopping timer");
          timerStarted = false;
          clearTimeout(timer);
      }

      function init() {
        $("#activity").change(function() {
          changeActivity(this.value);
        });

        $("#play").on("click", function() {
          start();
        });

        $("#play-stop").on("click", function() {
          stop();
        });



        $("#timeline").change(function() {
          if (currentPoints && currentPoints.length > 0) {
            var point = currentPoints[this.value];
            changePoint(point);
          }


           // Cache this for efficiency
           el = $(this);
           
           // Measure width of range input
           width = el.width();
           
           // Figure out placement percentage between left and right of input
           newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
           
           // Janky value to get pointer to line up better
           offset = -5.1;
           
           // Prevent bubble from going beyond left or right (unsupported browsers)
           if (newPoint < 0) { newPlace = 0; }
           else if (newPoint > 1) { newPlace = width; }
           else { newPlace = width * newPoint + offset; offset -= newPoint; }
           
           // Move bubble
           el
             .next(".tooltiptext")
             .css({
               left: newPlace,
               marginLeft: offset + "%"
             })
             .text(point.time);
        });

        var current = null;
        $.ajax({
          url: "tracks.php",
          dataType: 'json'
        }).done(function( data ) {
          if (data) {
            var select = document.getElementById("activity");
            for (value in data) {
              if (current == null) {
                current = data[value];
                changeActivity(current);
              }
              var opt = document.createElement('option');
              opt.value = data[value];
              opt.innerHTML = data[value];
              select.appendChild(opt);
            }
            select.selectedIndex = 0;
          }
        });
    	}

  function changePoint(point) {
    speedString = (point.speed * 1.94384).toFixed(1) + " kts | " +
            (point.speed * 3.6).toFixed(1) + " kmh | " +
            + point.speed + " m/s";
    $('#speed').html(speedString);
    $('#temperature').html(point.temperature);
    $('#datetime').html(point.datetime);

    if (marker) {
      console.log("update marker");
      marker.setPosition({lat: point.lat, lng: point.lng});
    } else {
      console.log("create marker");
      marker = new google.maps.Marker({
        position: {lat: point.lat, lng: point.lng},
        map: map,
        icon: currentIcon
      });
    }
  }

  function changeActivity(activity) {
        marker = null;
        $.ajax({
          url: "tracks.php?file=" + activity,
          dataType: 'json'
        }).done(function( data ) {
          if (data && data.points) {
            currentPoints = data.points;
            if (data.type == 'Sailing') {
              currentIcon = 'http://maps.google.com/mapfiles/ms/micons/sailing.png'
            } else if (data.type == 'Wandern') {
              currentIcon = 'http://maps.google.com/mapfiles/ms/micons/hiker.png'
            }
            initActivity(data.start, data.end, data.points, data.speed)
            $("#timeline").trigger('change');
          }
        });
  }

  function initActivity(start, end, points, speed) {
        stop(); 
        numPoints = points.length -1;
        
        var timeline = $('#timeline');
        timeline.attr('max', numPoints);
        timeline.val(0);

        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: {lat: start.lat, lng: start.lng},
          mapTypeId: 'terrain'
        });

        changePoint(points[0]);
        var speedRange = speed.max / 10;

        var previousPoint = start;
        var colors = [
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
        $.each(points, function(index, point) {
 
          var colorIndex = Math.ceil(point.speed / speedRange);
          var color = colors[colorIndex];

          var trackCoordinates = [
          	{lat: previousPoint.lat, lng: previousPoint.lng},
          	{lat: point.lat, lng: point.lng}
          ];
          
          var path = new google.maps.Polyline({
	          path: trackCoordinates,
	          geodesic: true,
	          strokeColor: color,
	          strokeOpacity: 1.0,
	          strokeWeight: 2
	      });

	      path.setMap(map);      	

        previousPoint = point;
        timeline.focus();
		});

      }
    </script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=<?php echo file_get_contents('.google-maps-key');?>&callback=init"></script></div></body></html>