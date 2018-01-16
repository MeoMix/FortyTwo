const axios = require('axios');
const logger = require('../common/logger.js');

module.exports = class KucoinApi {

  constructor(){
    this._baseUrl = `https://api.kucoin.com/v1`;
  }

  async getMarkets(){
    const marketDtos = await this._get(`market/open/symbols`);
    return marketDtos.map(marketDto => {
      return {
        symbol: marketDto.coinType,
        baseSymbol: marketDto.coinTypePair
      };
    });
  }

  async _get(endpoint, params){
    const url = `${this._baseUrl}/${endpoint}`;

    logger.info(`Requesting ${url} with params:`, params);
    const response = await axios.get(url, { params });
    const { success, msg, data } = response.data;

    if (success) {
      return data;
    }
    
    throw new Error(msg);
  }

};