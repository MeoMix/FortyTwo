const QueryType = require('./queryType.js');
const { map, filter, find } = require('lodash');

module.exports = class Query {

  constructor({ username = '', words = [], coins = null } = {}) {
    this.username = username;
    this.words = words;
    this.type = this._getQueryType(words.length ? words.shift() : '');
    this.flags = map(filter(words, word => this._isCommand(word)), flag => flag.trim().toUpperCase().replace('-', ''));
    this.values = map(filter(words, word => !this._isCommand(word)), value => value.trim().toUpperCase());

    this.coins = filter(coins, ({ symbol, name }) => find(this.values, value => symbol === value || name.toUpperCase() === value));
    this.coin = this.coins.length === 1 ? this.coins[0] : null;
  }

  _getQueryType(query) {
    switch (query.toUpperCase()) {
    case '!CALL':
    case '!CALLS':
      return QueryType.Call;
    case '!CALC':
      return QueryType.Calc;
    case '!COIN':
    case '!C':
      return QueryType.CoinDetails;
    case '!POSITIONS':
    case '!P':
      return QueryType.Positions;
    case '!BUY':
    case '!B':
      return QueryType.Buy;
    case '!SELL':
    case '!S':
      return QueryType.Sell;
    case '!WATCH':
    case '!W':
      return QueryType.Watch;
    case '!?':
    case '!HELP':
      return QueryType.Help;
    case '!TIME':
      return QueryType.Time;
    case '!CALENDAR':
      return QueryType.Calendar;
    default:
      return QueryType.None;
    }
  }

  _isCommand(word) {
    return word.trim().startsWith('-');
  }

};