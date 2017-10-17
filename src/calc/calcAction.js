const QueryType = require('../query/queryType.js');
const { toCodeBlock } = require('../common/utility.js');
const math = require('mathjs');
const { map, find } = require('lodash');

module.exports = class CalcAction {

  constructor({ words = [] } = {}, { coins = null } = {}) {
    this.words = words;
    this.coins = coins;

    this.coinProperties = [
      'price_btc',
      'price_usd',
      'percent_change_1h',
      'percent_change_24',
      'percent_change_7d',
      'volume',
      'market_cap_usd',
      'available_supply',
      'total_supply'
    ];
  }

  static get type() { return QueryType.Calc; }

  async execute() {
    const equation = this._getEquation();
 
    let result;
    try {
      result = `${equation} = ${math.eval(equation)}`;
    } catch({ message }){
      result = message;
    }

    return toCodeBlock(`${result}`);
  }

  _getEquation(){
    const symbols = map(this.coins, 'symbol');

    return map(this.words, word => this._replaceVariable(word, symbols)).join(' ');
  }

  _replaceVariable(word, symbols){
    const upperWord = word.toUpperCase();

    for(const coinProperty of this.coinProperties){
      const upperCoinProperty = coinProperty.toUpperCase();
      
      if(!upperWord.includes(upperCoinProperty)) continue;

      for(const symbol of symbols){
        if(upperWord.includes(`${symbol}_${upperCoinProperty}`)){
          // TODO: Symbol isn't uniquely identifying. I need a way of prompting user for clarification.
          return find(this.coins, { symbol })[coinProperty];
        }
      }
    }

    return word;
  }

};