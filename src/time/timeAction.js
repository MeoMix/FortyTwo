const moment = require('moment-timezone');
const { maxBy } = require('lodash');
const { toCodeBlock } = require('../common/utility.js');

module.exports = class TimeAction {

  constructor() {
    this.timeFormat = 'ddd MM/DD hh:mm A';
    this.cities = this._getCities();
    this.maxCityNameLength = maxBy(this.cities, 'name.length').name.length;
  }

  async execute() {
    return toCodeBlock(this.cities.map(city => this._getFormattedTime(city)));
  }

  // Take a name/continent pairing and returns a user-readable version.
  // For instance:
  // { name: 'Foo', continent: 'Bar' } => "Foo: Sun 01/01 00:01 AM"
  _getFormattedTime({ name, continent }){
    return `${`${name}:`.padStart(this.maxCityNameLength + 1)} ${moment().tz(`${continent}/${name.replace(/ /g, '_')}`).format(this.timeFormat)}\n`;
  }

  _getCities(){
    return [{
      name: 'Los Angeles',
      continent: 'America'
    }, {
      name: 'New York',
      continent: 'America'
    }, {
      name: 'London',
      continent: 'Europe'
    }, {
      name: 'Shanghai',
      continent: 'Asia'
    }, {
      name: 'Seoul',
      continent: 'Asia'
    }, {
      name: 'Tokyo',
      continent: 'Asia'
    }];
  }

};