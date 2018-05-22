const Channel = require('./channel.js');

module.exports = class ChannelDao {

  constructor({ channelDefinition } = {}){
    if(!channelDefinition) throw new Error(`ChannelDao expects channelDefinition`);

    this.channelDefinition = channelDefinition;
  }

  async create({ id, isCallChannel } = {}){
    return await this.channelDefinition.create({ id, isCallChannel });
  }

  async update({ id, isCallChannel } = {}){
    return await this.channelDefinition.update({ isCallChannel }, { where: { id }});
  }

  async get(id){
    const channelModel = await this.channelDefinition.findOne({ where: { id } });
    return channelModel ? this._getInstance(channelModel) : null;
  }

  async getCallChannels(){
    const channelModels = await this.channelDefinition.findAll({ where: { isCallChannel: true } });
    return channelModels.map(channelModel => this._getInstance(channelModel));
  }

  _getInstance({ id, isCallChannel } = {}){
    return new Channel({ id, isCallChannel });
  }

};