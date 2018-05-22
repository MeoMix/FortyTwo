const { differenceBy } = require('lodash');
const mixin = require('es6-class-mixin');
const EventEmitter = require('events');

// A mixin for exchanges. Provides the ability to automatically
// update the list of known markets for the exchange. Causes the
// exchange to emit an event when new markets are found.
module.exports = class AutomaticMarketUpdates extends mixin(EventEmitter) {

  // By default, a market using AutomaticMarketUpdates will run its market update logic once per minute
  constructor({ enableAutomaticUpdates = true, updateIntervalDelay = 60000 } = {}){    
    super(...arguments);

    this.updateIntervalDelay = updateIntervalDelay;
    this.updateIntervalId = null;

    if(enableAutomaticUpdates){
      this.enableAutomaticUpdates();
    }
  }

  enableAutomaticUpdates(){
    if(this.updateIntervalId){
      console.warn(`Automatic updates are already enabled`);
      return;
    }

    console.log('Enabling automatic updates');
    this.updateIntervalId = setInterval(async () => await this.addNewMarkets(), this.updateIntervalDelay);
  }

  disableAutomaticUpdates(){
    if(!this.updateIntervalId){
      console.log(`Automatic updates are already disabled`);
      return;
    }

    console.log(`Disabling automatic updates`);
    clearInterval(this.updateIntervalId);
    this.updateIntervalId = null;
  }

  async addNewMarkets(){
    console.log(`${this.name} - Checking for new markets`);
    const markets = differenceBy((await this.api.getMarkets('BTC')), this.markets, 'symbol');

    if(!markets.length){
      console.log(`${this.name} - No new markets found`);
      return;
    }

    const symbols = markets.map(({ symbol }) => symbol);
    console.log(`${this.name} - Found ${symbols.length} new market${symbols.length === 1 ? '' : 's'}: ${symbols.join(',')}`);

    this.markets.push(...markets);
    this.emit('add:markets', markets);
  }

};