const Watch = require('./watch.js');
const { getAllEntities, createEntity, deleteEntity } = require('../common/database.js');
const { map, remove } = require('lodash');

module.exports = class Watches extends Array {

  constructor(...watches) {
    super(...map(watches, Watch.getInstance));
  }
  
  async load() {
    this.length = 0;
    this.push(await getAllEntities('watch'), Watch.getInstance);
  }

  async add(watch) {
    const watchInstance = Watch.getInstance(watch);
    watchInstance.id = await createEntity(`watch`, watchInstance);
    this.push(watchInstance);

    return watchInstance;
  }

  async remove(username, coinId){
    const removedEntities = remove(this, { username, coinId });

    for(const entity of removedEntities){
      await deleteEntity(`watch`, entity.id);
    }
  }

};