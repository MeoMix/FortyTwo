const moment = require('moment');

module.exports = class CalendarItem {

  constructor({ username = '', notes = '', date = null } = {}) {
    this.username = username;
    this.notes = notes;
    this.date = date ? moment(date) : date;
  }

  static getInstance(calendarItem) {
    return calendarItem instanceof CalendarItem ? calendarItem : new CalendarItem(calendarItem);
  }

};