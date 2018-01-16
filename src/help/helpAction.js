const Help = require('./help.js');
const { toCodeBlock } = require('../common/utility.js');
const { find } = require('lodash');

module.exports = class HelpAction {

  constructor({ values = [] } = {}) {
    this.values = values;
    this.queryName = values.length ? values[0] : '';

    // TODO: When watch is better supported, add it to the docs.
    const helps = [this._getCalc(), this._getCall(), this._getCoin(), this._getTime(), this._getTipJar()];
    this.help = find(helps, { id: this.queryName });
  }

  async validate() {
    if (this.queryName && !this.help) {
      return `Unknown query: ${this.queryName}.`;
    }
  }

  async execute() {
    return this.help ? `${this.help}` : this._getHelpIntro();
  }

  _getHelpIntro() {
    return toCodeBlock(`Supported queries: coin, call, calc, time, tipjar. Say !help <query> for more information.`);
  }

  _getCoin() {
    return new Help({
      id: 'COIN',
      command: '!c, !coin',
      description: 'Get market information for a given coin, or for the overall market.',
      examples: ['!c', '!c -24h', '!c -7d', '!c wtc', '!c wtc -a'],
      flags: [
        '-a: Get all information instead of just highlights.',
        '-24h: Show best performing coins over last 24 hours. (Default: 1 hour)',
        '-7d: Show best performing coins over last 7 days. (Default: 1 hour)'],
    });
  }

  _getBuy() {
    return new Help({
      id: 'BUY',
      command: '!b, !buy',
      description: 'Buy an amount of a coin at the specified price. Merges with existing position if found.',
      examples: ['!b wtc 200@.001']
    });
  }

  _getSell() {
    return new Help({
      id: 'SELL',
      command: '!s, !sell',
      description: 'Sell a given amount, or all, of a coin that you own.',
      examples: ['!s wtc 200', '!s wtc -a'],
      flags: ['-a: Sell entire position instead of a given amount.']
    });
  }

  _getPosition() {
    return new Help({
      id: 'POSITION',
      command: '!p, !position',
      description: 'Get current positions for yourself, a given coin, or the overall market.',
      examples: ['!p', '!p -a', '!p wtc'],
      flags: ['-a: Get market positions instead of yourself.']
    });
  }

  _getCall() {
    return new Help({
      id: 'CALL',
      command: '!call, !calls',
      description: 'Call a coin at a given price, or at current market price.',
      examples: ['!call wtc', '!call wtc .001', '!call -d -a'],
      flags: ['-d: Delete a call instead of creating.', '-a: Delete all calls. No effect without -d flag.', '-i: Show only your calls rather than all calls.']
    });
  }

  _getCalc() {
    return new Help({
      id: 'CALC',
      command: '!calc',
      description: 'Calculate the answer to a given equation.',
      examples: ['!calc 1 + 2']
    });
  }

  _getTime() {
    return new Help({
      id: 'TIME',
      command: '!time',
      description: 'Display the current time around the world.',
      examples: ['!time']
    });
  }

  _getTipJar(){
    return new Help({
      id: 'TIPJAR',
      command: '!tipjar',
      description: 'Display tipjar donation information.',
      examples: ['!tipjar']
    });
  }

};