const mixin = require('es6-class-mixin');
const EventEmitter = require('events');
const logger = require('../common/logger.js');

module.exports = class ExchangeMonitor extends mixin(EventEmitter) {

  constructor(exchanges){
    super(...arguments);

    if(!exchanges || !exchanges.length) throw new Error(`ExchangeMonitor expects exchanges to be given`);
    this.exchanges = exchanges;

    // Run monitoring logic once per minute (60,000 milliseconds)
    this.intervalDelay = 60000;
    this.intervalId = null;
  }

  startMonitoring(){
    logger.info('ExchangeMonitor is starting');
    this.stopMonitoring();
    this.intervalId = setInterval(() => this.updateExchangeSymbols(), this.intervalDelay);
  }

  stopMonitoring(){
    clearInterval(this.interevalId);
  }

  // Check API for new currencies. If found, update tracking information.
  async updateExchangeSymbols(){
    logger.info('ExchangeMonitor - Updating exchange symbols');

    for(const exchange of this.exchanges){
      const addedSymbols = await exchange.addNewSymbols();

      for(const addedSymbol of addedSymbols){
        this.emit('newSymbol', {
          exchangeName: exchange.name,
          symbol: addedSymbol
        });
      }
    }
  }

};