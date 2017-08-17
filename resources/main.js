class Main {

  constructor() {
    this._currentDate = false;
    this._calenderSelector = '.calendar';
    this._activitySelector = '#activity';
    this._timelineSelector = '#timeline';
    this._playSelector = '#play';
    this._stopSelector = '#play-stop';

    this._activities = [];

    this.calendar = new Calendar('.calendar')
    this.calendar.setClickHandler(function (data) {
      if (data.count > 0) {
        this.setDate(data.date);
      } else {
        console.log('no data');
      }
    }.bind(this));

    this.fetchCalendarDates();
  }

  fetchCalendarDates(calendar) {
    $.ajax({
      url: "tracks.php?dates",
      dataType: 'json'
    }).done(function(data) {
      if (data) {
        let dates = [];
        for (let d in data) {
          dates.push({
            date: moment(d).toDate(),
            count: data[d]
          });
        }
        this.calendar.setDates(dates);
        this.calendar.render();
      } else {
        console.log("Not able to fetch dates - sorry!");
      }
    }.bind(this));
  }

  setDate(date) {
    this._currentDate = date;
    this.fetchActivities()
  }

  fetchActivities() {
    let dateString = moment(this._currentDate).format("YYYY-MM-DD");
    if (!this._activities[dateString]) {
      $.ajax({
        url: "tracks.php?date=" + dateString,
        dataType: 'json'
      }).done(function( data ) {
        if (data) {
          let activities = [];
          for (let value in data) {
            activities.push(data[value]);
          }
          this._activities[dateString] = activities;

        //   var current = null;
        //   $('#activity').empty();
        //   var select = document.getElementById("activity");
        //   for (value in data) {
        //     if (current == null) {
        //       current = data[value];
        //       changeActivity(moment(date).format("YYYY-MM-DD") + "/" +current);
        //     }
        //     var opt = document.createElement('option');
        //     opt.value = moment(date).format("YYYY-MM-DD") + "/" + data[value];
        //     opt.innerHTML = data[value];
        //     select.appendChild(opt);
        //   }
        //   select.selectedIndex = 0;
          console.log(this._activities);
        } else {
          console.log("Not able to fetch activities - sorry!");
        }
      }.bind(this));
    } else {
      console.log(this._activities);
    }


  }

  initListeners() {
    $(this._activitySelector).change(function() {
      // changeActivity(this.value);
    });
    $(this._playSelector).on("click", function() {
      // start();
    });

    $(this._stopSelector).on("click", function() {
      // stop();
    });

    $(this._timelineSelector).change(function() {
      // if (currentPoints && currentPoints.length > 0) {
      //   var point = currentPoints[this.value];
      //   changePoint(point);
      // }
    });
  }

}


// on window ready
function init() {
  main = new Main();
}


// var currentPoints = null;
// var map = null;
// var marker = null;
// var currentIcon = false;
// var timer = false;
// var timerStarted = false;

// function init() {
//   $.ajax({
//     url: "tracks.php?dates",
//     dataType: 'json'
//   }).done(function( data ) {
//     if (data) {
//       initCalendar(data);
//     }
//   });


//   initListeners();
// }

// function initListeners() {
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
//   });


// }


// function drawLines(points) {
//   // var numPointsToRemove = points.length - 1500;
//   // console.log("points to remove " + numPointsToRemove);
//   var lineData = [];
//   for (var i in points) {
//     //if (i >= 1500) { break; }
//     lineData.push({
//       x: i + 1,
//       y: points[i].speed
//     })
//   }
//   maxSpeed = d3.max(lineData, function(d) {
//     return d.y;
//   });
//   maxTime = d3.max(lineData, function(d) {
//     return d.x;
//   });
//   console.log("lineData length " + lineData.length);
//   // Define the div for the tooltip
//   // var div = d3.select("body").append("div") 
//   //     .attr("class", "tooltip")       
//   //     .style("opacity", 0);

//   $("#visualisation").empty();
//   $("#visualisation").attr('width', '100%');
//   var vis = d3.select('#visualisation'),
//   WIDTH = 100,
//   HEIGHT = 100,
//   MARGINS = {
//     top: 0,
//     right: 0,
//     bottom: 0,
//     left: 0
//   },
//   xRange = d3.scale.linear().range([
//     MARGINS.left,
//     WIDTH - MARGINS.right
//   ]).domain([d3.min(lineData, function(d) {
//     return d.x;
//   }), d3.max(lineData, function(d) {
//     return d.x;
//   })]),
//   yRange = d3.scale.linear().range([
//     HEIGHT - MARGINS.top,
//     MARGINS.bottom
//   ]).domain([d3.min(lineData, function(d) {
//     return d.y;
//   }), d3.max(lineData, function(d) {
//     return d.y;
//   })]);

//   xAxis = d3.svg.axis()
//     .scale(xRange)
//     .tickSize(1)
//     .tickSubdivide(false),
//   yAxis = d3.svg.axis()
//     .scale(yRange)
//     .tickSize(1)
//     .orient('left')
//     .tickSubdivide(false);

//   vis.append('svg:g')
//     .attr('class', 'x axis')
//     .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
//     .call(xAxis);

//   vis.append('svg:g')
//     .attr('class', 'y axis')
//     .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
//     .call(yAxis);

//   var lineFunc = d3.svg.line()
//     .x(function(d) {
//       return xRange(d.x);
//     })
//     .y(function(d) {
//       return yRange(d.y);
//     })
//     .interpolate('linear');

//   var maxLine = d3.svg.line()
//     .x(function(d) {
//       return xRange(d.x);
//     })
//     .y(function(d) {
//       return yRange(maxSpeed);
//     })
//     .interpolate('linear');

//   var minLine = d3.svg.line()
//     .x(function(d) {
//       return xRange(d.x);
//     })
//     .y(function(d) {
//       return yRange(0);
//     });


//   vis.append('svg:path')
//     .attr('d', maxLine(lineData))
//     .attr('stroke', 'red')
//     .attr('stroke-width', 1)
//     .attr('fill', 'none');

//   vis.append('svg:path')
//     .attr('d', minLine(lineData))
//     .attr('stroke', 'blue')
//     .attr('stroke-width', 1)
//     .attr('fill', 'none');

//   vis.append('svg:path')
//     .attr('d', lineFunc(lineData))
//     .attr('stroke', '#c6e48b')
//     .attr('stroke-width', 1)
//     .attr('fill', 'none');


//   // Add the scatterplot
//   // vis.selectAll("dot")  
//   //     .data(lineData)     
//   // .enter().append("circle")               
//   //     .attr("r", 5)   
//   //     .attr("cx", function(d) { return xRange(d.x); })     
//   //     .attr("cy", function(d) { return yRange(d.y); })   
//   //     .on("mouseover", function(d) {    
//   //         div.transition()    
//   //             .duration(200)    
//   //             .style("opacity", .9);    
//   //         div .html(d.y);  
//   //         })          
//   //     .on("mouseout", function(d) {   
//   //         div.transition()    
//   //             .duration(500)    
//   //             .style("opacity", 0); 
//   //     });

// }

// function initCalendar(data) {
//   var chartData = [];
//   for (d in data) {
//     chartData.push({
//       date: moment(d).toDate(),
//       count: data[d]
//     });
//   }

//   var now = moment().endOf('day').toDate();
//   var yearAgo = moment().startOf('day').subtract(1, 'year').toDate();

//   var heatmap = calendarHeatmap()
//     .data(chartData)
//     .selector('.calendar')
//     .tooltipEnabled(true)
//     .colorRange(['#c6e48b', '#196127'])
//     .onClick(function (data) {
//       if (data.count > 0) {
//         initByDate(data.date);
//       } else {
//         console.log('no data');
//       }
//     })
//     .tooltipUnit('Einträge')
//     .locale({
//       months: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
//       days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
//       No: 'keine',
//       on: 'an',
//       Less: 'wenig',
//       More: 'mehr'
//     });
//   heatmap();
// }


// function initByDate(date) {
//   $.ajax({
//     url: "tracks.php?date=" + moment(date).format("YYYY-MM-DD"),
//     dataType: 'json'
//   }).done(function( data ) {
//     if (data) {
//       var current = null;
//       $('#activity').empty();
//       var select = document.getElementById("activity");
//       for (value in data) {
//         if (current == null) {
//           current = data[value];
//           changeActivity(moment(date).format("YYYY-MM-DD") + "/" +current);
//         }
//         var opt = document.createElement('option');
//         opt.value = moment(date).format("YYYY-MM-DD") + "/" + data[value];
//         opt.innerHTML = data[value];
//         select.appendChild(opt);
//       }
//       select.selectedIndex = 0;
//     }
//   });
// }

// function changeActivity(activity) {
//   marker = null;
//   activity = activity.split('/');
//   $.ajax({
//     url: "tracks.php?file=" + activity[1] + "&file_date=" + activity[0],
//     dataType: 'json'
//   }).done(function( data ) {
//     if (data && data.points) {
//       currentPoints = data.points;
//       drawLines(data.points);

//       if (data.type == 'Sailing') {
//         currentIcon = 'http://maps.google.com/mapfiles/ms/micons/sailing.png'
//       } else if (data.type == 'Wandern') {
//         currentIcon = 'http://maps.google.com/mapfiles/ms/micons/hiker.png'
//       }
//       initActivity(data.start, data.end, data.points, data.speed, data.duration)
//       $("#timeline").trigger('change');
//     }
//   });
// }      

// function play() {
//   if (timerStarted == false) {
//     return;
//   }

//   speed = 1000 / $("#speed-factor").val()
//   currentPos = Number($("#timeline").val());
//   $("#timeline").val(currentPos + 1);
//   $("#timeline").trigger("change");
//   if (currentPos + 1 >= Number($("#timeline").attr("max"))) {
//     stop();
//   }
//   timer = setTimeout(function(){ play() }, speed);
// }

// function start() {
//     if (timerStarted == false) {
//       timerStarted = true;
//       $("#play").hide();
//       $("#play-stop").show();
//       play();
//     }
// }

// function stop() {
//     timerStarted = false;
//     clearTimeout(timer);
//     $("#play").show();
//     $("#play-stop").hide();
// }

// function changePoint(point) {
//   var dd = new Date(point.datetime)
//   var d = Date.parse(point.datetime);
//   speedString = (point.speed * 1.94384).toFixed(1) + " kts | " +
//           (point.speed * 3.6).toFixed(1) + " kmh | " +
//           + point.speed + " m/s";
//   $('#speed').html(speedString);
//   $('#temperature').html(point.temperature);
//   $('#datetime').html(point.datetime);

//   if (marker) {
//     marker.setPosition({lat: point.lat, lng: point.lng});
//   } else {
//     marker = new google.maps.Marker({
//       position: {lat: point.lat, lng: point.lng},
//       map: map,
//       icon: currentIcon
//     });
//   }
// }

// function initActivity(start, end, points, speed, duration) {
//       stop(); 
//       numPoints = points.length -1;
//       $('#duration').html(duration + " " + numPoints);
      

//       var timeline = $('#timeline');
//       timeline.attr('max', numPoints);
//       timeline.val(0);

//       map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 13,
//         center: {lat: start.lat, lng: start.lng},
//         mapTypeId: 'terrain'
//       });

//       changePoint(points[0]);
//       var speedRange = speed.max / 10;

//       var previousPoint = start;
//       var colors = [
//         "#000fff",
//         "#0060ff",
//         "#039dfd",
//         "#00f0fc",
//         "#3effbe",
//         "#8fff6f",
//         "#cfff2f",
//         "#ffdf00",
//         "#ff8e01",
//         "#ff3f00",
//         "#fe0000"
//       ];
//       $.each(points, function(index, point) {

//         var colorIndex = Math.ceil(point.speed / speedRange);
//         var color = colors[colorIndex];

//         var trackCoordinates = [
//           {lat: previousPoint.lat, lng: previousPoint.lng},
//           {lat: point.lat, lng: point.lng}
//         ];
        
//         var path = new google.maps.Polyline({
//           path: trackCoordinates,
//           geodesic: true,
//           strokeColor: color,
//           strokeOpacity: 1.0,
//           strokeWeight: 2
//       });

//       path.setMap(map);       

//       previousPoint = point;
//       timeline.focus();
//   });
// }