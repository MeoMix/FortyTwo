const moment = require('moment');

module.exports = class CalendarItem {

  constructor({ id = 0, userId = '', notes = '', date = null } = {}) {
    this.id = id;
    this.userId = userId;
    this.notes = notes;
    this.date = date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : date;
  }
  
};