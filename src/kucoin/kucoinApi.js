const axios = require('axios');
const { filter } = require('lodash');

module.exports = class KucoinApi {

  constructor(){
    this._baseUrl = `https://api.kucoin.com/v1`;
  }

  async getMarkets(baseSymbol){
    try {
      const marketDtos = await this._get(`market/open/symbols`);     
      const markets = marketDtos.map(marketDto => this._getMarket(marketDto));

      return baseSymbol ? filter(markets, { baseSymbol }) : markets;
    } catch(error){
      console.error(`Failed to get Kucoin markets. Reason:`, error.message);
      return [];
    }
  }

  async _get(endpoint, params){
    const url = `${this._baseUrl}/${endpoint}`;

    const response = await axios.get(url, { params });
    const { success, msg, data } = response.data;

    if (success) {
      return data;
    }
    
    throw new Error(msg);
  }

  _getMarket(marketDto){
    return {
      symbol: marketDto.coinType,
      baseSymbol: marketDto.coinTypePair
    };
  }

};