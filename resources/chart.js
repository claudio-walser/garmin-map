"use strict";

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

}


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