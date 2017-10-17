const QueryType = require('../query/queryType.js');
const Helps = require('./helps.js');
const { toCodeBlock } = require('../common/utility.js');

module.exports = class HelpAction {

  constructor({ values = [] } = {}) {
    this.values = values;
    this.queryName = values.length ? values[0] : '';

    // TODO: When watch is better supported, add it to the docs.
    const helps = new Helps(this._getBuy(), this._getCalc(), this._getCall(), this._getCoin(), this._getPositions(), this._getSell(), this._getTime());
    this.help = helps.get(this.queryName);
  }

  static get type() { return QueryType.Help; }

  async validate() {
    if (this.queryName && !this.help) {
      return `Unknown query: ${this.queryName}.`;
    }
  }

  async execute() {
    return this.help ? `${this.help}` : this._getHelpIntro();
  }

  _getHelpIntro() {
    return toCodeBlock(`Supported queries: coin, buy, sell, positions, call, calc, time. Say !help <query> for more information.`);
  }

  _getCoin() {
    return {
      id: 'COIN',
      command: '!c, !coin',
      description: 'Get market information for a given coin, or for the overall market.',
      examples: ['!c', '!c wtc', '!c wtc -a'],
      flags: ['-a: Get all information instead of just highlights.'],
    };
  }

  _getBuy() {
    return {
      id: 'BUY',
      command: '!b, !buy',
      description: 'Buy an amount of a coin at the specified price. Merges with existing position if found.',
      examples: ['!b wtc 200@.001']
    };
  }

  _getSell() {
    return {
      id: 'SELL',
      command: '!s, !sell',
      description: 'Sell a given amount, or all, of a coin that you own.',
      examples: ['!s wtc 200', '!s wtc -a'],
      flags: ['-a: Sell entire position instead of a given amount.']
    };
  }

  _getPositions() {
    return {
      id: 'POSITIONS',
      command: '!p, !positions',
      description: 'Get current positions for yourself, a given coin, or the overall market.',
      examples: ['!p', '!p -a', '!p wtc'],
      flags: ['-a: Get market positions instead of yourself.']
    };
  }

  _getCall() {
    return {
      id: 'CALL',
      command: '!call, !calls',
      description: 'Call a coin at a given price, or at current market price.',
      examples: ['!call wtc', '!call wtc .001', '!call -d -a'],
      flags: ['-d: Delete a call instead of creating.', '-a: Delete all calls. No effect without -d flag.', '-i: Show only your calls rather than all calls.']
    };
  }

  _getCalc() {
    return {
      id: 'CALC',
      command: '!calc',
      description: 'Calculate the answer to a given equation.',
      examples: ['!calc 1 + 2']
    };
  }

  _getTime() {
    return {
      id: 'TIME',
      command: '!time',
      description: 'Display the current time around the world.',
      examples: ['!time']
    };
  }

};