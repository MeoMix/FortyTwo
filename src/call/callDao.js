const Call = require('./call.js');
const Sequelize = require('sequelize');

module.exports = class CallDao {

  constructor(database){
    this.database = database;
    this.tableName = 'call';

    this.definition = database.sequelize.define(this.tableName, {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      guildId: { type: Sequelize.STRING(32), allowNull: false },
      userId: { type: Sequelize.STRING(32), allowNull: false },
      coinId: { type: Sequelize.STRING(32), allowNull: false },
      price: { type: Sequelize.DECIMAL, allowNull: false },
      calledOn: { type: Sequelize.DATE, allowNull: false }
    });
  }

  async create({ id, userId, guildId, coinId, price, calledOn } = {}){
    return await this.definition.create({ id, userId, coinId, guildId, price, calledOn });
  }

  async removeByUserId(guildId, userId){
    return await this.definition.destroy({ where: { guildId, userId } });
  }

  async remove(guildId, userId, coinId){
    return await this.definition.destroy({ where: { guildId, userId, coinId } });
  }
  
  async get(guildId, userId, coinId){
    const callModel = await this.definition.findOne({ where: { guildId, userId, coinId } });
    return callModel ? this._getInstance(callModel) : null;
  }

  async getByUserId(guildId, userId, limit){
    const callModels = await this.definition.findAll({ where: { guildId, userId }, limit, order: [['calledOn', 'DESC']] });
    return callModels.map(callModel => this._getInstance(callModel));
  }

  async getAll(guildId, limit){
    const callModels = await this.definition.findAll({ where: { guildId }, limit, order: [['calledOn', 'DESC']] });
    return callModels.map(callModel => this._getInstance(callModel));
  }

  _getInstance({ id, userId, coinId, price, calledOn } = {}){
    return new Call({ id, userId, coinId, price, calledOn });
  }

};