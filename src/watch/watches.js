const Watch = require('./watch.js');
const { read, write } = require('../common/utility.js');
const { map, remove } = require('lodash');
const mkdirp = require('async-mkdirp');

module.exports = class Watches extends Array {

  constructor(...watches) {
    super(...map(watches, Watch.getInstance));

    this.directoryPath = `/discord/bot`;
    this.filePath = `${this.directoryPath}/watches.json`;
  }
  
  async load() {
    await mkdirp(this.directoryPath);

    this.length = 0;
    this.push(await read(this.filePath), Watch.getInstance);
  }

  async add(watch) {
    this.push(Watch.getInstance(watch));    
    await write(this.filePath, this);

    return this[this.length - 1];
  }

  async remove(username, coinId){
    remove(this, { username, coinId });
    await write(this.filePath, this);
  }

};