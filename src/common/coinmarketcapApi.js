const axios = require('axios');
const { map } = require('lodash');

module.exports = class CoinmarketcapApi {

  constructor(){
    this._baseUrl = `https://api.coinmarketcap.com/v1/`;
  }

  async getTickers() {
    const { data } = await axios.get(`${this._baseUrl}/ticker`);

    return map(data, tickerDto => {
      return {
        id: tickerDto.id,
        name: tickerDto.name,
        symbol: tickerDto.symbol,
        price_btc: parseFloat(tickerDto.price_btc),
        price_usd: parseFloat(tickerDto.price_usd),
        percent_change_1h: parseFloat(tickerDto.percent_change_1h),
        percent_change_24h: parseFloat(tickerDto.percent_change_24h),
        percent_change_7d: parseFloat(tickerDto.percent_change_7d),
        volume: parseFloat(tickerDto['24h_volume_usd']),
        market_cap_usd: parseFloat(tickerDto.market_cap_usd),
        available_supply: parseFloat(tickerDto.available_supply),
        total_supply: parseFloat(tickerDto.total_supply)
      };
    });
  }

};