const moment = require('moment-timezone');
const { toCodeBlock } = require('../common/utility.js');

module.exports = class TimeCommand {

  constructor() {
    this.timeFormat = 'ddd MM/DD hh:mm A';
    this.cities = [{
      name: 'Los Angeles',
      utcOffset: 'UTC -8',
      continent: 'America'
    }, {
      name: 'New York',
      utcOffset: 'UTC -5',
      continent: 'America'
    }, {
      name: 'London',
      utcOffset: 'UTC +0',
      continent: 'Europe'
    }, {
      name: 'Shanghai',
      utcOffset: 'UTC +8',
      continent: 'Asia'
    }, {
      name: 'Seoul',
      utcOffset: 'UTC +9',
      continent: 'Asia'
    }, {
      name: 'Tokyo',
      utcOffset: 'UTC +9',
      continent: 'Asia'
    }];
  }

  async execute() {
    const labelledTimes = this.cities.map(city => this._getLabelledTime(city));
    const maxLabelLength = Math.max(...(labelledTimes.map(labelledTime => labelledTime.label.length)));
    const formattedTimes = labelledTimes.map(labelledTime => this._getFormattedTime(labelledTime, maxLabelLength));

    return toCodeBlock(formattedTimes.join('\n'));
  }

  // Returns a labelled representation of a city's time
  _getLabelledTime({ name, continent, utcOffset }){
    return { label: name, time: `${this._getCityTime(name, continent)} (${utcOffset})` };
  }

  // Returns a representation of local time for the given city/continent.
  _getCityTime(name, continent){
    return moment().tz(`${continent}/${name.replace(/ /g, '_')}`).format(this.timeFormat);
  }

  // Take a label/time pairing and returns a user-readable version.
  // Pad labels names such that they're all visually aligned.
  _getFormattedTime({ label, time }, maxLabelLength){
    return `${`${label}:`.padStart(maxLabelLength + 1)} ${time}`;
  }

};