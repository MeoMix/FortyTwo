const { find } = require('lodash');
const logger = require('../common/logger.js');

// TODO: Move all of this to a separate project. Should be able to just query for the coin data I need without
// having all the details in this project.
module.exports = class CoinStateRefresher {

  constructor(coins, coinmarketcapApi, gdaxApi) {
    this.coins = coins;
    this.coinmarketcapApi = coinmarketcapApi;
    this.refreshInterval = null;

    this.gdaxCoins = ['LTC', 'ETH', 'BTC'];
    this.gdaxApi = gdaxApi;
  }

  startRefreshing() {
    clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(async () => await this.refresh(), 15000);
  }

  async refresh() {
    const tickers = await this.coinmarketcapApi.getTickers();

    for (const ticker of tickers) {
      if(!ticker.id || !ticker.name){
        logger.warn('invalid ticker', ticker.id, ticker.name);
      } else {
        if(this.coins.get(ticker.id)){
          this.coins.update(ticker);
        } else {
          this.coins.add(ticker);
        }
      }
    }

    // TODO: Prefer using socket api here:
    for (const coinSymbol of this.gdaxCoins){
      const ticker = await this.gdaxApi.getProductTicker(`${coinSymbol}-USD`);
      const coin = find(this.coins, { symbol: coinSymbol });
      
      if(coin){
        coin.gdaxPrice = parseFloat(ticker.price);
      }
    }

  }

};