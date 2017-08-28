"use strict";

class SpeedChart {
  constructor(selector) {
    this._selector = selector;
    d3.select(selector);
    let viz = vizuly.viz.radial_progress($(selector).get(0));

	viz.data(0)                       // Current value
            .height(400)                    // Height of component - radius is calculated automatically for us
            .min(0)                         // min value
            .max(100)                       // max value
            .capRadius(1)                   // Sets the curvature of the ends of the arc.
            .on("tween", this.onTween)            // On the arc animation we create a callback to update the label
            .on("mouseover", this.onMouseOver)    // mouseover callback - all viz components issue these events
            .on("mouseout", this.onMouseOut)      // mouseout callback - all viz components issue these events
            .on("click", this.onClick); 

    viz.startAngle(250)                         // Angle where progress bar starts
        .endAngle(110)                           // Angle where the progress bar stops
        .arcThickness(.12)                        // The thickness of the arc (ratio of radius)
        .label(function (d,i) {                  // The 'label' property allows us to use a dynamic function for labeling.
            return String(this._speedLabel);
        }.bind(this));
    vizuly.theme.radial_progress(viz).skin(vizuly.skin.RADIAL_PROGRESS_BUSINESS);
     this.viz = viz;
    this.changeSize("400,400");
    this._maxSpeed = 0;
  }


 onTween(viz,i) {
    viz.selection().selectAll(".vz-radial_progress-label")
        .text(viz.label()(viz.data() * i));
}

onMouseOver(viz,d,i) {
    //We can capture mouse over events and respond to them
}

onMouseOut(viz,d,i) {
    //We can capture mouse out events and respond to them
}

onClick(viz,d,i) {
    //We can capture click events and respond to them
}

changeSize(val) {
    var s = String(val).split(",");
    //viz_container.transition().duration(300).style('width', s[0] + 'px').style('height', s[1] + 'px');

    var divWidth = s[0] * 0.80 / 3;
    let div = d3.select(this._selector);
        div.style("width",divWidth + 'px').style("margin-left", (s[0] *.05) + "px");
        this.viz.width(divWidth).height(divWidth).radius(divWidth/2.2).update();

}


setSpeedLabel(speedLabel) {
  this._speedLabel = speedLabel;
}

update(currentSpeed) {
  if (this._maxSpeed == 0) {
    return;
  }
 this.viz.data(Number(100 / this._maxSpeed * currentSpeed)).duration(0).update();
 //this.viz.data(Number(100 / this._maxSpeed * currentSpeed)).update();
}
     
setMaxSpeed(maxSpeed) {
  this._maxSpeed = maxSpeed;
}


  // setPoints(points) {
  //   this._points = points;
  // }

  // update(currentSpeed) {
  // 	this._currentSpeed = currentSpeed;
  // }

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