const axios = require('axios');
const { filter } = require('lodash');

module.exports = class BinanceApi {

  constructor(){
    this._baseUrl = `https://api.binance.com`;
  }

  async getMarkets(baseSymbol){
    try {
      const marketDtos = await this._get(`api/v1/ticker/allBookTickers`);
      const markets = marketDtos.map(marketDto => this._getMarket(marketDto));

      return baseSymbol ? filter(markets, { baseSymbol }) : markets;
    } catch(error){
      console.error(`Failed to get Binance markets. Reason:`, error);
      return [];
    }
  }

  async _get(endpoint, params){
    const url = `${this._baseUrl}/${endpoint}`;

    const response = await axios.get(url, { params });
    const data = response.data;

    if (data) {
      return data;
    }
    
    throw new Error(response);
  }

  _getMarket(marketDto){
    const baseSymbol = this._getBaseSymbol(marketDto.symbol);
    const symbol = marketDto.symbol.replace(new RegExp(`${baseSymbol}$`), '');

    return {
      symbol,
      baseSymbol
    };
  }

  _getBaseSymbol(symbolPair){
    const baseSymbols = ['BTC', 'ETH', 'BNB', 'USDT'];
 
    for(const baseSymbol of baseSymbols){
      if(symbolPair.endsWith(baseSymbol)){
        return baseSymbol;
      }
    }

    console.warn(`Symbol not found for symbolPair: ${symbolPair}`);
    return '';
  }

};