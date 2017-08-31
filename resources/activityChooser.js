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
    $(this._selector).show();
  }

  render() {
    let select = $("<select></select>");
    select.change(this._handlerFunction);
  	for (let key in this._activities){
      let value = this._activities[key].value;
      let label = this._activities[key].label;
	    select.append($('<option>', { 
        value: value,
        text : label
      }));
  	}
  	$(this._selector).empty();
    $(this._selector).append('<span>Choose Activity: </span>');
    $(this._selector).append(select);
    
    select.trigger('change');
  }
}