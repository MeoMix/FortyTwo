const { toCodeBlock } = require('../common/utility.js');
const math = require('mathjs');
const { groupBy, reduce } = require('lodash');

// Calculator utility. Integrates with external math library to perform
// a variety of math operations. Allows for the use of variables referencing
// properties of Coins.
module.exports = class CalcCommand {

  constructor({ words = [] } = {}, coinDao) {
    if(!coinDao) throw new Error(`CalcCommand expects coinDao`);

    this.words = words;
    this.coinDao = coinDao;

    this.coinProperties = [
      // TODO: Support price_btc again by injecting BTC coin into method
      // 'price_btc',
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
    const equation = await this._getEquation();

    let result;
    try {
      // Print the number with commas with up to 20 digits after the decimal place.
      result = `${equation} = ${Number(math.eval(equation)).toLocaleString(undefined, { maximumFractionDigits: 20 })}`;
    } catch({ message }){
      result = message;
    }

    return toCodeBlock(`${result}`);
  }

  async _getEquation(){
    // TODO: Instead of being lazy and using `getAll` try to do filtering at DB level.
    const allCoins = await this.coinDao.getAll();

    return this.words.map(word => this._replaceVariable(word, allCoins)).join(' ');
  }

  _replaceVariable(word, allCoins){
    // Determine the subset of coinProperties which are represented in the given word by
    // performing a case-insensitive test to see if `word` contains `property`.
    const filteredProperties = this.coinProperties.filter(property => (new RegExp(property, `i`)).test(word));
    const groupings = groupBy(allCoins.filter(coin => (new RegExp(coin.symbol, `i`)).test(word)), 'symbol');

    // Reduce the set of coins to only those with the highest volume.
    // TODO: Allow the user to choose which coins they want rather than force a default.
    const filteredCoins = reduce(groupings, (result, coins) => {
      result.push(coins.sort((a, b) => b.volume - a.volume)[0]);
      return result;
    }, []);

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