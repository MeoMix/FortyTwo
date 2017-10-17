
const QueryType = require('../query/queryType.js');
const Table = require('../common/table.js');
const moment = require('moment');
const { take } = require('lodash');

module.exports = class CalendarAction {

  constructor({ values = [], username = '', flags = [] } = {}, { calendarItems = null } = {}) {
    this.values = values;
    this.username = username;
    this.flags = flags;
    this.calendarItems = calendarItems;

    this.isDelete = flags.includes('D');

    if (values.length > 1) {
      this.date = moment(values[0]);
      this.notes = values.slices(1).join(' ');
    }
  }

  static get type() { return QueryType.Calendar; }

  async execute() {
    return this.date && this.notes ? this._addCalendarItem() : this._getCalendar();
  }

  async _addCalendarItem() {
    await this.calendarItems.add({
      date: this.date,
      notes: this.notes
    });

    return `Added calendar item`;
  }

  async _getCalendar() {
    const table = new Table(`Calendar`);
    table.setHeading([' ', 'User', 'Date', 'Notes']);

    for (const calendarItem of take(this.calendarItems, 20)) {
      table.addRow(table.getRows().length + 1, this.username, calendarItem.date.format('MM/DD HH:mm'), calendarItem.notes);
    }

    return `${table}`;
  }

};