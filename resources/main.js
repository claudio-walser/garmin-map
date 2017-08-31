"use strict";

class Main {

  constructor() {
    this._errorHandler = new ErrorHandler();
    this._currentDate = false;
    this._currentActivity = false;
    this._currentActivityName = '';
    this._mapSelector = '#map';
    this._calenderSelector = '.calendar';
    this._activitySelector = '.activity';
    this._timelineSelector = '.timeline';
    this._infoSelector = ".info";


    this._calendar = new Calendar(this._calenderSelector)
    this._calendar.setClickHandler(this.onDateChange.bind(this));
    this.fetchCalendarDates();

    this._activiyChooser = new ActivityChooser(this._activitySelector);
    this._activiyChooser.setChangeHandler(this.onActivityChange.bind(this));

    this._timeline = new Timeline(this._timelineSelector);
    this._timeline.setOnChangeHandler(this.onTimelineChange.bind(this));

    this._map = new Map(this._mapSelector);

    this._activityInfo = new ActivityInfo(this._infoSelector);



    // this._playSelector = '#play';
    // this._stopSelector = '#play-stop';
    // this._speedFactorSelector = '#speed-factor';
    this._secondsElapsed = 0;
    this._activities = [];
    this._loadedActivities = [];

    // this._timeline.setPlaySelector(this._playSelector);
    // this._timeline.setStopSelector(this._stopSelector);
    // this._timeline.setSpeedFactorSelector(this._speedFactorSelector);


  }

  fetchCalendarDates() {
    $.ajax({
      url: "tracks.php?dates",
      dataType: 'json'
    }).done(function(data) {
      if (data) {
        let dates = [];
        for (let d in data) {
          dates.push({
            date: moment(d).toDate(),
            count: data[d]['count'],
            additionalMessage: data[d]['activities'].join(', ')
          });
        }
        this._calendar.setDates(dates);
      } else {
        this._errorHandler.error("Not able to fetch dates - sorry!");
      }
    }.bind(this));
  }

  onActivityChange(data) {
    let activityKey = this._currentDateString + "/" + data.currentTarget.value;
    if (!this._loadedActivities[activityKey]) {
      $.ajax({
        url: "tracks.php?file=" + data.currentTarget.value + "&file_date=" + this._currentDateString,
        dataType: 'json'
      }).done(function( data ) {
        if (data && data.points) {
          this._currentActivity = data;
          this._loadedActivities[activityKey] = this._currentActivity;
          this._currentActivityName = activityKey;
          this.initActivity(this._currentActivity);
        } else {
          this._errorHandler.error("Not able to load activity - sorry!")
        }
      }.bind(this));
    } else {
      this._currentActivity = this._loadedActivities[activityKey];
      if  (this._currentActivityName != activityKey) {
        this._currentActivityName = activityKey;
        this.initActivity(this._currentActivity);
      }
    }
  }

  onDateChange(data) {
    let date;
    if (data.count > 0) {
      date = data.date;
    } else {
      this._errorHandler.error('no data');
      return;
    }

    this._currentDate = date;
    this._currentDateString = moment(this._currentDate).format("YYYY-MM-DD");
    this.fetchActivities()
  }

  fetchActivities() {
    let dateString = moment(this._currentDate).format("YYYY-MM-DD");
    if (!this._activities[this._currentDateString]) {
      $.ajax({
        url: "tracks.php?date=" + this._currentDateString,
        dataType: 'json'
      }).done(function( data ) {
        if (data) {
          let activities = [];
          for (let value in data) {
            activities.push(data[value]);
          }
          this._activities[this._currentDateString] = activities;
          this._activiyChooser.setActivities(this._activities[this._currentDateString]);
        } else {
          this._errorHandler.error("Not able to fetch activities - sorry!");
        }
      }.bind(this));
    } else {
      this._activiyChooser.setActivities(this._activities[this._currentDateString]);
    }
  }

  initActivity(activity) {
    this._map.setActivity(activity);
    this._activityInfo.setActivity(activity);
    this._timeline.updateMaxValue(activity.points.length - 1);
  }

  onTimelineChange(data) {
    this._secondsElapsed = data.currentTarget.value;
    if (!this._currentActivity.points[this._secondsElapsed]) {
      this._errorHandler.error("This point does not exist - sorry!");
      return;
    }

    this.setCurrentPoint(this._currentActivity.points[this._secondsElapsed]);
  }

  setCurrentPoint(point) {
    this._map.update(point);
    this._activityInfo.update(point, this._secondsElapsed);
  }

}

// on window ready
function init() {
  let main = new Main();
}
