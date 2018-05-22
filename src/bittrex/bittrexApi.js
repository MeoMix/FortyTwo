const axios = require('axios');
const { filter } = require('lodash');

module.exports = class BittrexApi {

  constructor(){
    this._baseUrl = `https://bittrex.com/api/v1.1`;
  }

  async getMarkets(baseSymbol){
    try {
      const marketDtos = await this._get(`public/getmarkets`);
      const markets = marketDtos.map(marketDto => this._getMarket(marketDto));

      return baseSymbol ? filter(markets, { baseSymbol }) : markets;
    } catch(error){
      console.error(`Failed to get Bittrex markets. Reason:`, error.message);
      return [];
    }
  }

  async _get(endpoint, params){
    const url = `${this._baseUrl}/${endpoint}`;

    const response = await axios.get(url, { params });
    const { success, message, result } = response.data;

    if (success) {
      return result;
    }
    
    throw new Error(message);
  }

  _getMarket(marketDto){
    return {
      symbol: marketDto.MarketCurrency,
      baseSymbol: marketDto.BaseCurrency
    };
  }

};