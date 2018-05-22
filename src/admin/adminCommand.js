module.exports = class AdminCommand {

  // TODO: Check admin privs.
  constructor({ channelId, flags = [], user = null } = {}, channelDao) {
    this.flags = flags;
    this.channelDao = channelDao;
    this.channelId = channelId;
    this.user = user;

    // TODO: Maybe this shouldn't be a flag.
    this.isSetCallChannel = flags.includes('SETCALLCHANNEL');
    this.isDelete = flags.includes('D');
  }

  async validate(){
    // TODO: Not super clear to me what needs to happen to achieve this.
    // if(!this.user.isAdmin){
    //   return `You must be a moderator of this channel to use admin commands.`;
    // }

    if(this.isSetCallChannel && !this.channelId){
      return 'No channel id';
    }

    if(!this.isSetCallChannel){
      return `Unknown admin command`;
    }
  }

  async execute(){
    if(this.isSetCallChannel){
      if(this.isDelete){
        return await this._removeCallChannel();
      } else {
        return await this._addCallChannel();
      }
    }
  }

  async _removeCallChannel(){
    const channel = await this.channelDao.get(this.channelId);

    if(channel){
      channel.isCallChannel = false;
      await this.channelDao.update(channel);
    }

    return `Trading calls will no longer appear in this channel.`;
  }

  async _addCallChannel(){    
    const channel = await this.channelDao.get(this.channelId);

    if(channel){
      channel.isCallChannel = true;
      await this.channelDao.update(channel);
    } else {
      await this.channelDao.create({
        id: this.channelId,
        isCallChannel: true
      });
    }

    return `Trading calls will now appear in this channel.`;
  }

};