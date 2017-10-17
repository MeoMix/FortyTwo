const mixin = require('es6-class-mixin');
const EventEmitter = require('events');

module.exports = class Coin extends mixin(EventEmitter) {

  constructor({ id, name, symbol, price_btc, price_usd, percent_change_1h, percent_change_24h, percent_change_7d, volume, market_cap_usd, available_supply, total_supply } = {}) {
    super(...arguments);

    this.id = id;
    this.name = name;
    this.symbol = symbol;
    this.price_btc = price_btc;
    this.price_usd = price_usd;
    this.percent_change_1h = percent_change_1h;
    this.percent_change_24h = percent_change_24h;
    this.percent_change_7d = percent_change_7d;
    this.volume = volume;
    this.market_cap_usd = market_cap_usd;
    this.available_supply = available_supply;
    this.total_supply = total_supply;

    return new Proxy(this, {
      set(target, key, value, receiver){
        const originalValue = Reflect.get(target, key, receiver);
        const result = Reflect.set(target, key, value, receiver);
        const currentValue = Reflect.get(target, key, receiver);

        if(originalValue !== currentValue){
          target.emit(`change:${key}`, currentValue);
        }

        return result;
      }
    });
  }

  static getInstance(coin){
    return coin instanceof Coin ? coin : new Coin(coin);
  }
  
};