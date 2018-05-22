const mixin = require('es6-class-mixin');
const AutomaticMarketUpdates = require('../exchange/automaticMarketUpdates.js');

module.exports = class KucoinExchange extends mixin(AutomaticMarketUpdates) {

  constructor({ api, markets } = {}){
    super(...arguments);

    this.name = 'Kucoin';
    this.api = api;
    this.markets = markets;
  }

};