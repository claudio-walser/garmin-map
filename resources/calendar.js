"use strict";

class Calendar {

  constructor(selector) {
    this._selector = selector;
    console.log('calendar initialized');
  }

  setClickHandler(handlerFunction) {
  	this._handlerFunction = handlerFunction;
  }

  setDates(dates) {
    this._dates = dates;
    this.render();
  }

  render() {
	  var heatmap = calendarHeatmap()
	    .data(this._dates)
	    .selector(this._selector)
	    .tooltipEnabled(true)
	    .colorRange(['#c6e48b', '#196127'])
	    .onClick(this._handlerFunction)
	    // 	function (data) {
	    //   if (data.count > 0) {
	    //     initByDate(data.date);
	    //   } else {
	    //     console.log('no data');
	    //   }
	    // })
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
}