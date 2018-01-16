const Channel = require('./channel.js');
const Sequelize = require('sequelize');

module.exports = class ChannelDao {

  constructor(database){
    this.database = database;
    this.tableName = 'channel';

    this.definition = database.sequelize.define(this.tableName, {
      id: { type: Sequelize.STRING(32), allowNull: false, primaryKey: true },
      isCallChannel: { type: Sequelize.BOOLEAN, allowNull: false }
    });
  }

  async create({ id, isCallChannel } = {}){
    return await this.definition.create({ id, isCallChannel });
  }

  async update({ id, isCallChannel } = {}){
    return await this.definition.update({ isCallChannel }, { where: { id }});
  }

  async get(id){
    const channelModel = await this.definition.findOne({ where: { id } });
    return channelModel ? this._getInstance(channelModel) : null;
  }

  async getCallChannels(){
    const channelModels = await this.definition.findAll({ where: { isCallChannel: true } });
    return channelModels.map(channelModel => this._getInstance(channelModel));
  }

  _getInstance({ id, isCallChannel } = {}){
    return new Channel({ id, isCallChannel });
  }

};