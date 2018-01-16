const CalendarItem = require('./calendarItem.js');
const Sequelize = require('sequelize');

module.exports = class CalendarItemDao {

  constructor(database){
    this.database = database;
    this.tableName = 'calendaritem';    

    this.definition = database.sequelize.define(this.tableName, {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.STRING(32), allowNull: false },
      notes: { type: Sequelize.STRING(1000), allowNull: false },
      date: { type: Sequelize.DATE, allowNull: false }
    });
  }

  async create({ id, userId, notes, date } = {}){
    return await this.definition.create({ id, userId, notes, date });
  }

  async getAll(limit){
    const calendarItemModels = await this.definition.findAll({ limit });
    return calendarItemModels.map(calendarItemModel => this._getInstance(calendarItemModel));
  }

  _getInstance({ id, userId, notes, date } = {}){
    return new CalendarItem({ id, userId, notes, date });
  }

};