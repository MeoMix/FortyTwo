const axios = require('axios');
const logger = require('../common/logger.js');

module.exports = class BittrexApi {

  constructor(){
    // Bittrex's API endpoint.
    this._baseUrl = `https://bittrex.com/api/v1.1`;
  }

  async getMarkets(){
    return await this._get(`public/getmarkets`);
  }

  async _get(endpoint, params){
    const url = `${this._baseUrl}/${endpoint}`;

    logger.info(`Requesting ${url} with params:`, params);
    const response = await axios.get(url, { params });
    const { success, message, result } = response.data;

    if (success) {
      return result;
    }
    
    throw new Error(message);
  }

};