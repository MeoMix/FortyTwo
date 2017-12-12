const moment = require('moment');

module.exports = class CalendarItem {

  constructor({ id = 0, username = '', notes = '', date = null } = {}) {
    this.id = id;
    this.username = username;
    this.notes = notes;
    this.date = date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : date;
  }

  static getInstance(calendarItem) {
    return calendarItem instanceof CalendarItem ? calendarItem : new CalendarItem(calendarItem);
  }

};