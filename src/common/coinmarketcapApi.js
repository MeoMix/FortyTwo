const axios = require('axios');
const { map, pickBy, groupBy, values, maxBy, reject, flatten, includes } = require('lodash');
const cheerio = require('cheerio');

module.exports = class CoinmarketcapApi {

  constructor(){
    this._baseUrl = `https://api.coinmarketcap.com/v1/`;
  }

  async getTickers() {
    const { data } = await axios.get(`${this._baseUrl}/ticker/?limit=0`);

    const tickers = map(data, tickerDto => {
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

    // There might be duplicate symbols represented in tickers because some trash coins
    // share the same symbol as legitimate coins. Filter out the trash coins by selecting highest volume.
    const duplicateTickerSets = values(pickBy(groupBy(tickers, 'symbol'), group => group.length > 1));
    const excludedTickers = flatten(map(duplicateTickerSets, tickerSet => reject(tickerSet, maxBy(tickerSet, 'volume'))));

    return reject(tickers, ticker => includes(excludedTickers, ticker));
  }

  async getExchanges(coinId){
    const { data } = await axios.get(`https://coinmarketcap.com/currencies/${coinId}/`);
    const $ = cheerio.load(data);

    const exchangeRows = $('#markets-table').find('td:nth-child(2)').slice(0, 5);
    const tradedPairRows = $('#markets-table').find('td:nth-child(3) a').slice(0, 5);

    const exchanges = tradedPairRows.map((index, element) => {
      const $element = $(element);

      return {
        exchangeName: $(exchangeRows[index]).text(),
        pairName: $element.text(),
        href: $element.attr('href')
      };
    }).get();

    return exchanges;
  }

};