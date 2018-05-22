
const Table = require('../common/table.js');
const moment = require('moment');

module.exports = class CalendarCommand {

  constructor({ values = [], flags = [] } = {}, bot, calendarItemDao) {
    if(!bot) throw new Error(`CalendarCommand expects bot`);
    if(!calendarItemDao) throw new Error(`CalendarCommand expects calendarItemDao`);

    this.values = values;
    this.flags = flags;
    this.calendarItemDao = calendarItemDao;
    this.bot = bot;
    this.isDelete = flags.includes('D');

    if (values.length > 1) {
      this.date = moment(values[0]);
      this.notes = values.slices(1).join(' ');
    }
  }

  async execute() {
    return this.date && this.notes ? await this._addCalendarItem() : await this._getCalendar();
  }

  async _addCalendarItem() {
    await this.calendarItemDao.create({
      date: this.date,
      notes: this.notes
    });

    return `Added calendar item`;
  }

  async _getCalendar() {
    const table = new Table(`Calendar`);
    table.setHeading([' ', 'User', 'Date', 'Notes']);

    for (const calendarItem of this.calendarItemDao.getAll(20)) {
      const user = this.bot.getUser(calendarItem.userId);
      table.addRow(table.getRows().length + 1, user.username, calendarItem.date.format('MM/DD HH:mm'), calendarItem.notes);
    }

    return `${table}`;
  }

};