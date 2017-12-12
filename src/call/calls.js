const Call = require('./call.js');
const { getAllEntities, deleteEntity, createEntity } = require('../common/database.js');
const { map, remove, find } = require('lodash');

module.exports = class Calls extends Array  {

  constructor(...calls) {
    super(...map(calls, Call.getInstance));
  }

  async load() {
    this.length = 0;
    this.push(...map(await getAllEntities('call'), Call.getInstance));
  }

  async add(call) {
    const callInstance = Call.getInstance(call);
    callInstance.id = await createEntity(`call`, callInstance);

    this.push(callInstance);   

    return callInstance;
  }

  async remove(username, coinId){
    const removedEntities = remove(this, { username, coinId });

    for(const entity of removedEntities){
      await deleteEntity(`call`, entity.id);
    }
  }

  async removeByUsername(username){
    const removedEntities = remove(this, { username });

    // TODO: Sloppy
    for(const entity of removedEntities){
      await deleteEntity(`call`, entity.id);
    }
  }

  get(coinId, username){
    return find(this, { coinId, username });
  }
  
};