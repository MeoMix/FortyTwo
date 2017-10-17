const CalendarItem = require('./calendarItem.js');
const { read, write } = require('../common/utility.js');
const { map } = require('lodash');
const mkdirp = require('async-mkdirp');

module.exports = class CalendarItems extends Array {

  constructor(...calendarItems) {
    super(...map(calendarItems, CalendarItem.getInstance));

    this.directoryPath = `/discord/bot`;
    this.filePath = `${this.directoryPath}/calendarItems.json`;
  }

  async load() {
    await mkdirp(this.directoryPath);

    this.length = 0;
    this.push(...map(await read(this.filePath), CalendarItem.getInstance));
  }

  async add(calendarItem) {
    this.push(CalendarItem.getInstance(calendarItem));
    await write(this.filePath, this);

    return this[this.length - 1];
  }

};