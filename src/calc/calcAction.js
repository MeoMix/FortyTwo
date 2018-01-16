const { toCodeBlock } = require('../common/utility.js');
const math = require('mathjs');
const { map, filter } = require('lodash');

// Calculator utility. Integrates with external math library to perform
// a variety of math operations. Allows for the use of variables referencing
// properties of Coins.
module.exports = class CalcAction {

  constructor({ words = [] } = {}, coins) {
    if(!coins || !coins.length) throw new Error(`CalcAction expects coins`);

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
    // TODO: Symbol isn't uniquely identifying. I need a way of prompting user for clarification.
    const symbols = map(this.coins, 'symbol');

    return map(this.words, word => this._replaceVariable(word, symbols)).join(' ');
  }

  _replaceVariable(word){
    // Determine the subset of coinProperties which are represented in the given word by
    // performing a case-insensitive test to see if `word` contains `property`.
    const filteredProperties = filter(this.coinProperties, property => (new RegExp(property, `i`)).test(word));
    const filteredCoins = filter(this.coins, ({ symbol }) => (new RegExp(symbol, `i`)).test(word));

    // Replace all coin.symbol_property variables with corresponding values.
    for(const property of filteredProperties){
      for(const coin of filteredCoins){
        const regExp = new RegExp(`${coin.symbol}_${property}`, `ig`);
        word = word.replace(regExp, coin[property]);
      }
    }

    return word;
  }

};