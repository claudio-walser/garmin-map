"use strict";

class Calendar {

  constructor(selector) {
    this._selector = selector;
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
	    .onClick(this._handlerFunction);
	    // .tooltipUnit('Einträge')
	    // .locale({
	    //   months: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
	    //   days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
	    //   No: 'keine',
	    //   on: 'an',
	    //   Less: 'wenig',
	    //   More: 'mehr'
	    // });
	  heatmap();
  }
}