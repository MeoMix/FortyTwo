const mixin = require('es6-class-mixin');
const AutomaticMarketUpdates = require('../exchange/automaticMarketUpdates.js');

module.exports = class BittrexExchange extends mixin(AutomaticMarketUpdates) {

  constructor({ api, markets } = {}){
    super(...arguments);

    this.name = 'Bittrex';
    this.api = api;
    this.markets = markets;
  }

};