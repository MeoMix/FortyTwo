const Call = require('./call.js');
const { read, write } = require('../common/utility.js');
const { map, remove, find } = require('lodash');
const mkdirp = require('async-mkdirp');

module.exports = class Calls extends Array  {

  constructor(...calls) {
    super(...map(calls, Call.getInstance));

    this.directoryPath = `/tmp/discord/bot`;
    this.filePath = `${this.directoryPath}/calls.json`;
  }

  async load() {
    await mkdirp(this.directoryPath);

    this.length = 0;
    this.push(...map(await read(this.filePath), Call.getInstance));
  }

  async add(call) {
    this.push(Call.getInstance(call));
    await write(this.filePath, this);
    
    return this[this.length - 1];
  }

  async remove(username, coinId){
    remove(this, { username, coinId });
    await write(this.filePath, this);
  }

  async removeByUsername(username){
    remove(this, { username });
    await write(this.filePath, this);
  }

  get(coinId, username){
    return find(this, { coinId, username });
  }
  
};