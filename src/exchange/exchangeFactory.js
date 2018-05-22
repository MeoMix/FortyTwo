const BittrexExchange = require('../bittrex/bittrexExchange.js');
const BittrexApi = require('../bittrex/bittrexApi.js');
const BinanceExchange = require('../binance/binanceExchange.js');
const BinanceApi = require('../binance/binanceApi.js');
const KucoinExchange = require('../kucoin/kucoinExchange.js');
const KucoinApi = require('../kucoin/kucoinApi.js');

module.exports = class ExchangeFactory {

  constructor(){
    this._binanceExchange = null;
    this._bittrexExchange = null;
    this._kucoinExchange = null;
  }

  async getExchanges(){
    return await Promise.all([
      this.getBittrexExchange(),
      this.getBinanceExchange(),
      this.getKucoinExchange()
    ]);
  }

  async getBittrexExchange(){
    if(!this._bittrexExchange){
      const bittrexApi = new BittrexApi();
    
      this._bittrexExchange = new BittrexExchange({
        api: bittrexApi,
        markets: await bittrexApi.getMarkets('BTC')
      });
    }

    return this._bittrexExchange;
  }

  async getBinanceExchange(){
    if(!this._binanceExchange){
      const binanceApi = new BinanceApi();

      return new BinanceExchange({
        api: binanceApi,
        markets: await binanceApi.getMarkets('BTC')
      });
    }

    return this._binanceExchange;
  }

  async getKucoinExchange(){
    if(!this._kucoinExchange){
      const kucoinApi = new KucoinApi();

      this._kucoinExchange = new KucoinExchange({
        api: kucoinApi,
        markets: await kucoinApi.getMarkets('BTC')
      });
    }

    return this._kucoinExchange;
  }

};