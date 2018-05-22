const mixin = require('es6-class-mixin');
const EventEmitter = require('events');

module.exports = class Coin extends mixin(EventEmitter) {

  constructor({ id = 0, name = '', symbol = '', websiteSlug = '', rank = 0, price_usd = 0, percent_change_1h = 0, percent_change_24h = 0, percent_change_7d = 0, volume = 0, market_cap_usd = 0, available_supply = 0, total_supply = 0, markets = [] } = {}) {
    super(...arguments);

    this.id = id;
    this.name = name;
    this.symbol = symbol;
    this.websiteSlug = websiteSlug;
    this.rank = rank;
    this.price_usd = price_usd;
    this.percent_change_1h = percent_change_1h;
    this.percent_change_24h = percent_change_24h;
    this.percent_change_7d = percent_change_7d;
    this.volume = volume;
    this.market_cap_usd = market_cap_usd;
    this.available_supply = available_supply;
    this.total_supply = total_supply;
    this.markets = markets;

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
  
};