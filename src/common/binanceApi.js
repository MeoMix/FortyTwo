const axios = require('axios');
const logger = require('../common/logger.js');

module.exports = class BinanceApi {

  constructor(){
    this._baseUrl = `https://api.binance.com`;
  }

  async getMarkets(){
    const marketDtos = await this._get(`api/v1/ticker/allBookTickers`);

    return marketDtos.map(marketDto => {
      const baseSymbol = this._getBaseSymbol(marketDto.symbol);
      const symbol = marketDto.symbol.replace(new RegExp(`${baseSymbol}$`), '');

      return {
        symbol,
        baseSymbol
      };
    });
  }

  async _get(endpoint, params){
    const url = `${this._baseUrl}/${endpoint}`;

    logger.info(`Requesting ${url} with params:`, params);
    const response = await axios.get(url, { params });
    const data = response.data;

    if (data) {
      return data;
    }
    
    throw new Error(response);
  }

  _getBaseSymbol(symbolPair){
    const baseSymbols = ['BTC', 'ETH', 'BNB', 'USDT'];
 
    for(const baseSymbol of baseSymbols){
      if(symbolPair.endsWith(baseSymbol)){
        return baseSymbol;
      }
    }

    logger.warn(`Symbol not found for symbolPair: ${symbolPair}`);
    return '';
  }

};