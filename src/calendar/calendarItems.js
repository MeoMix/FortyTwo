const CalendarItem = require('./calendarItem.js');
const { getAllEntities, createEntity } = require('../common/database.js');
const { map } = require('lodash');

module.exports = class CalendarItems extends Array {

  constructor(...calendarItems) {
    super(...map(calendarItems, CalendarItem.getInstance));
  }

  async load() {
    this.length = 0;
    this.push(...map(await getAllEntities('calendarItem'), CalendarItem.getInstance));
  }

  async add(calendarItem) {
    const calendarItemInstance = CalendarItem.getInstance(calendarItem);
    calendarItemInstance.id = await createEntity(`calendarItem`, calendarItemInstance);
    this.push(calendarItemInstance);

    return calendarItemInstance;
  }

};