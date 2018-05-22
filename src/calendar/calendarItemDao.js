const CalendarItem = require('./calendarItem.js');

module.exports = class CalendarItemDao {

  constructor({ calendarItemDefinition } = {}){
    if(!calendarItemDefinition) throw new Error(`CalendarItemDao expects calendarItemDefinition`);

    this.calendarItemDefinition = calendarItemDefinition;
  }

  async create({ id, userId, notes, date } = {}){
    return await this.calendarItemDefinition.create({ id, userId, notes, date });
  }

  async getAll(limit){
    const calendarItemModels = await this.calendarItemDefinition.findAll({ limit });
    return calendarItemModels.map(calendarItemModel => this._getInstance(calendarItemModel));
  }

  _getInstance({ id, userId, notes, date } = {}){
    return new CalendarItem({ id, userId, notes, date });
  }

};