const QueryType = require('./queryType.js');
const CoinConfirmation = require('../common/coinConfirmation.js');
const { map, filter, find, groupBy } = require('lodash');

module.exports = class Query {

  constructor({ username = '', words = [], coins = null } = {}) {
    this.username = username;
    this.words = words;
    this.type = this._getQueryType(words.length ? words.shift() : '');
    this.flags = map(filter(words, word => this._isCommand(word)), flag => flag.trim().toUpperCase().replace('-', ''));
    this.values = map(filter(words, word => !this._isCommand(word)), value => value.trim().toUpperCase());

    this.coins = filter(coins, ({ symbol, name }) => find(this.values, value => symbol === value || name.toUpperCase() === value));

    const duplicateCoinsBySymbol = filter(groupBy(this.coins, 'symbol'), coins => coins.length > 1);
    this.coinConfirmations = map(duplicateCoinsBySymbol, duplicates => new CoinConfirmation(...duplicates));
    this.coin = this.coins.length === 1 ? this.coins[0] : null;
  }

  get needsCoinConfirmation(){
    return this.coinConfirmations.length > 0 && this.type !== QueryType.None;
  }

  setChosenCoin(word){
    const isCancelled = word.toUpperCase() === 'CANCEL';   
    if(isCancelled){
      return { isSuccessful: false, isCancelled };
    }
  
    const choice = parseInt(word);
    const chosenCoin = this.coinConfirmations[0].coins[choice - 1];
    if(!chosenCoin){
      return { isSuccessful: false, isCancelled };
    }
  
    this.coin = chosenCoin;
    return { isSuccessful: true, isCancelled };
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