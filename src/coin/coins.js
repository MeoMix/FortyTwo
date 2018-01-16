const Coin = require('./coin.js');
const { map, find } = require('lodash');

module.exports = class Coins extends Array {

  constructor(...coins) {
    super(...map(coins, Coin.getInstance));
  }
  
  get(id) {
    return find(this, { id });
  }

  add(coin) {
    if (this.get(coin.id)){
      console.warn(`Coin with id ${coin.id} already added`);
      return;
    }
    
    this.push(Coin.getInstance(coin));
    return this[this.length - 1];
  }

  update({ id, price_btc, price_usd, percent_change_1h, percent_change_24h, percent_change_7d, volume, market_cap_usd, available_supply, total_supply }){
    let coin = this.get(id);

    if (!coin){
      console.warn(`Coin with id ${id} not found`);
      return;
    }

    coin.price_btc = price_btc;
    coin.price_usd = price_usd;
    coin.percent_change_1h = percent_change_1h;
    coin.percent_change_24h = percent_change_24h;
    coin.percent_change_7d = percent_change_7d;
    coin.volume = volume;
    coin.market_cap_usd = market_cap_usd;
    coin.available_supply = available_supply;
    coin.total_supply = total_supply;
  }

};