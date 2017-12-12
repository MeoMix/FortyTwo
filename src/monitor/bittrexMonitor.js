const { orderBy, filter, findIndex, take } = require('lodash');
const mixin = require('es6-class-mixin');
const EventEmitter = require('events');
const logger = require('../common/logger.js');

// Access Bittrex's API, record the current state of which coins are listed, and monitor for additional
// coins being listed in the API. Emit an event when it detects a new listing.
// Polls Bittrex's API once per minute. There is no clear guidelines on what rate limit is acceptable,
// but rough guidelines were suggested on their Slack: https://bitcoin.stackexchange.com/questions/53778/bittrex-api-rate-limit
module.exports = class BittrexMonitor extends mixin(EventEmitter) {

  constructor(api){
    super(...arguments);
    
    this.api = api;
    // Run monitoring logic once per minute (60,000 milliseconds)
    this.intervalDelay = 60000;
    this.newestCurrency = null;
    this.intervalId = null;
  }

  async initialize(){
    const markets = await this.getMarkets();
    this.newestCurrency = markets[0].MarketCurrency;
    logger.info(`newestCurrency: ${this.newestCurrency}`);
    this.start();
  }

  start(){
    logger.info('BittrexMonitor is starting');
    this.stop();
    this.intervalId = setInterval(this.checkCurrencies.bind(this), this.intervalDelay);
  }

  stop(){
    clearInterval(this.interevalId);
  }

  // Check API for new currencies. If found, update tracking information.
  async checkCurrencies(){
    logger.info('checking currencies');
    const markets = await this.getMarkets();
    const currencies = this.getNewCurrencies(markets);
    logger.info(`New currencies: ${currencies.length}`);
    if(currencies.length){
      this.updateNewCurrencies(currencies);
    }
  }

  // Updates which currency was last created and notifies subscribers
  // of currencies which were created recently.
  updateNewCurrencies(currencies){
    logger.info(`updateNewCurrencies: ${currencies}`);
    this.newestCurrency = currencies[0];

    for(const currency of currencies){
      this.emit('newCurrency', currency);
    }
  }

  // Returns currencies which appeared recently in the markets list by looking for
  // the last seen currency in the list and returning those which appear before it.
  getNewCurrencies(markets){
    const previousIndex = findIndex(markets, ({ MarketCurrency }) => MarketCurrency === this.newestCurrency);
    logger.info(`previousIndex: ${previousIndex}`);
    return take(markets, previousIndex).map(({ MarketCurrency }) => MarketCurrency);
  }

  // Returns markets which are traded as BTC ordered newest to oldest.
  // Only return BTC pairs because adding ETH pairs isn't a noteworthy event. The coin
  // is presumed to already be traded with the BTC pairing.
  async getMarkets(){
    // TODO: DTO around market.
    const markets = await this.api.getMarkets();
    const btcMarkets = filter(markets, { BaseCurrency: 'BTC' });

    return orderBy(btcMarkets, ({ Created }) => Created, 'desc');
  }

};