class ActivityChooser {

  constructor(selector) {
    this._selector = selector;
  }

  setChangeHandler(handlerFunction) {
  	this._handlerFunction = handlerFunction;
    $(this._selector).change(this._handlerFunction);
  }

  setActivities(activities) {
    this._activities = activities;
    this.render();
  }

  render() {
  	$(this._selector).empty();
  	for (let key in this._activities){
      let value = this._activities[key];
	  $(this._selector).append($('<option>', { 
	    value: value,
	    text : value 
      }));
  	}
  	$(this._selector).trigger('change');
  }
}