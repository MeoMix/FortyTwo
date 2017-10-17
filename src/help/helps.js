const Help = require('./help.js');
const { map, find } = require('lodash');

module.exports = class Helps extends Array {

  constructor(...helps) {
    super(...map(helps, Help.getInstance));
  }

  get(id) {
    return find(this, { id });
  }
  
  add(help) {
    this.push(Help.getInstance(help));
    return this[this.length - 1];
  }

};