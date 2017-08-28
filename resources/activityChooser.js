"use strict";

class ActivityChooser {

  constructor(selector) {
    this._selector = selector;
  }

  setChangeHandler(handlerFunction) {
  	this._handlerFunction = handlerFunction;
  }

  setActivities(activities) {
    this._activities = activities;
    this.render();
  }

  render() {
    let select = $("<select></select>");
    select.change(this._handlerFunction);


  	for (let key in this._activities){
      let value = this._activities[key];
	    select.append($('<option>', { 
        value: value,
        text : value 
      }));
  	}
  	$(this._selector).empty();
    $(this._selector).append('<span>Choose Activity: </span>');
    $(this._selector).append(select);
    
    select.trigger('change');
  }
}