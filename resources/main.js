function init() {
  $.ajax({
    url: "tracks.php?dates",
    dataType: 'json'
  }).done(function( data ) {
    if (data) {
      initCalendar(data);
      drawLines();

    }
  });

  $("#activity").change(function() {
    changeActivity(this.value);
  });
}

function drawLines() {

var lineData = [{
  x: 1,
  y: 5
}, {
  x: 20,
  y: 20
}, {
  x: 40,
  y: 10
}, {
  x: 60,
  y: 40
}, {
  x: 80,
  y: 5
}, {
  x: 100,
  y: 60
}];

    var vis = d3.select('#visualisation'),
    WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
    },
    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function(d) {
      return d.x;
    }), d3.max(lineData, function(d) {
      return d.x;
    })]),
    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function(d) {
      return d.y;
    }), d3.max(lineData, function(d) {
      return d.y;
    })]),
    xAxis = d3.svg.axis()
      .scale(xRange)
      .tickSize(5)
      .tickSubdivide(true),
    yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(5)
      .orient('left')
      .tickSubdivide(true);

console.log(vis);
vis.append('svg:g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
  .call(xAxis);

vis.append('svg:g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
  .call(yAxis);

var lineFunc = d3.svg.line()
  .x(function(d) {
    return xRange(d.x);
  })
  .y(function(d) {
    return yRange(d.y);
  })
  .interpolate('linear');

vis.append('svg:path')
  .attr('d', lineFunc(lineData))
  .attr('stroke', 'blue')
  .attr('stroke-width', 2)
  .attr('fill', 'none');
}

function initCalendar(data) {
  console.log('calendar')
  var chartData = [];
  for (d in data) {
    chartData.push({
      date: moment(d).toDate(),
      count: data[d]
    });
  }

  var now = moment().endOf('day').toDate();
  var yearAgo = moment().startOf('day').subtract(1, 'year').toDate();

  var heatmap = calendarHeatmap()
    .data(chartData)
    .selector('.calendar')
    .tooltipEnabled(true)
    .colorRange(['#c6e48b', '#196127'])
    .onClick(function (data) {
      if (data.count > 0) {
        initByDate(data.date);
      } else {
        console.log('no data');
      }
    })
    .tooltipUnit('Einträge')
    .locale({
      months: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
      days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      No: 'keine',
      on: 'an',
      Less: 'wenig',
      More: 'mehr'
    });
  heatmap();
}


function initByDate(date) {
  $.ajax({
    url: "tracks.php?date=" + moment(date).format("YYYY-MM-DD"),
    dataType: 'json'
  }).done(function( data ) {
    if (data) {
      var current = null;
      $('#activity').empty();
      var select = document.getElementById("activity");
      for (value in data) {
        if (current == null) {
          current = data[value];
          changeActivity(moment(date).format("YYYY-MM-DD") + "/" +current);
        }
        var opt = document.createElement('option');
        opt.value = moment(date).format("YYYY-MM-DD") + "/" + data[value];
        opt.innerHTML = data[value];
        select.appendChild(opt);
      }
      select.selectedIndex = 0;
    }
  });
}

function changeActivity(activity) {
  marker = null;
  activity = activity.split('/');
  $.ajax({
    url: "tracks.php?file=" + activity[1] + "&file_date=" + activity[0],
    dataType: 'json'
  }).done(function( data ) {
    if (data && data.points) {
      currentPoints = data.points;
      if (data.type == 'Sailing') {
        currentIcon = 'http://maps.google.com/mapfiles/ms/micons/sailing.png'
      } else if (data.type == 'Wandern') {
        currentIcon = 'http://maps.google.com/mapfiles/ms/micons/hiker.png'
      }
      initActivity(data.start, data.end, data.points, data.speed, data.duration)
      $("#timeline").trigger('change');
    }
  });
}      


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
            $("#play").hide();
            $("#play-stop").show();
            play();
          }
      }

      function stop() {
          timerStarted = false;
          clearTimeout(timer);
          $("#play").show();
          $("#play-stop").hide();
      }

      // function init() {
      //   $("#activity").change(function() {
      //     changeActivity(this.value);
      //   });

      //   $("#play").on("click", function() {
      //     start();
      //   });

      //   $("#play-stop").on("click", function() {
      //     stop();
      //   });



      //   $("#timeline").change(function() {
      //     if (currentPoints && currentPoints.length > 0) {
      //       var point = currentPoints[this.value];
      //       changePoint(point);
      //     }


      //      // Cache this for efficiency
      //      el = $(this);
           
      //      // Measure width of range input
      //      width = el.width();
           
      //      // Figure out placement percentage between left and right of input
      //      newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
           
      //      // Janky value to get pointer to line up better
      //      offset = -5.1;
           
      //      // Prevent bubble from going beyond left or right (unsupported browsers)
      //      if (newPoint < 0) { newPlace = 0; }
      //      else if (newPoint > 1) { newPlace = width; }
      //      else { newPlace = width * newPoint + offset; offset -= newPoint; }
           
      //      // Move bubble
      //      el
      //        .next(".tooltiptext")
      //        .css({
      //          left: newPlace,
      //          marginLeft: offset + "%"
      //        })
      //        .text(point.time);
      //   });

      //   $.ajax({
      //     url: "tracks.php?dates",
      //     dataType: 'json'
      //   }).done(function( data ) {
      //     if (data) {
      //       console.log(data);
      //     }
      //   });


      //   var current = null;
      //   $.ajax({
      //     url: "tracks.php",
      //     dataType: 'json'
      //   }).done(function( data ) {
      //     if (data) {
      //       var select = document.getElementById("activity");
      //       for (value in data) {
      //         if (current == null) {
      //           current = data[value];
      //           changeActivity(current);
      //         }
      //         var opt = document.createElement('option');
      //         opt.value = data[value];
      //         opt.innerHTML = data[value];
      //         select.appendChild(opt);
      //       }
      //       select.selectedIndex = 0;
      //     }
      //   });
      // }

  function changePoint(point) {
    var dd = new Date(point.datetime)
    var d = Date.parse(point.datetime);
    speedString = (point.speed * 1.94384).toFixed(1) + " kts | " +
            (point.speed * 3.6).toFixed(1) + " kmh | " +
            + point.speed + " m/s";
    $('#speed').html(speedString);
    $('#temperature').html(point.temperature);
    $('#datetime').html(point.datetime);

    if (marker) {
      marker.setPosition({lat: point.lat, lng: point.lng});
    } else {
      marker = new google.maps.Marker({
        position: {lat: point.lat, lng: point.lng},
        map: map,
        icon: currentIcon
      });
    }
  }



  function initActivity(start, end, points, speed, duration) {
        stop(); 
        numPoints = points.length -1;
        $('#duration').html(duration + " " + numPoints);
        

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