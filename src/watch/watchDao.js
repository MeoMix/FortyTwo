module.exports = class WatchDao {

  constructor({ watchDefinition } = {}){    
    if(!watchDefinition) throw new Error(`WatchDao expects watchDefinition`);

    this.watchDefinition = watchDefinition;
  }
  
  async remove(userId, coinId){
    return await this.watchDefinition.destroy({ where: { userId, coinId } });
  }
};