const axios = require('axios');
const cheerio = require('cheerio');

module.exports = class CoinmarketcapApi {

  getTickers() {
    console.log(`Retrieving all tickers from Coinmarketcap`);
    
    return axios.get(`https://api.coinmarketcap.com/v2/global/`)
      .catch(error => {
        console.error(`Failed to get global data from Coinmarketcap. Reason:`, error.message);
        return [];
      })
      .then(({ data }) => {
        // Prepare to issue N queries to CMC where batch size is 100.
        const totalBatchCount = Math.ceil(data.data.active_cryptocurrencies / 100);

        const requests = [];
        for (let batchCount = 0; batchCount < totalBatchCount; batchCount++) {
          const start = 1 + batchCount * 100; 
          const request = axios.get(`https://api.coinmarketcap.com/v2/ticker/?start=${start}`);
          requests.push(request);
        }

        return Promise.all(requests).catch(error => {
          console.error(`Failed to get ticker data from Coinmarketcap. Reason:`, error.message);
          return [];
        });
      })
      .then((responses) => {
        // NOTE: Object.values is Node 7.x+. GCF is Node 6.x at time of writing.
        const tickerDtoBatches = responses.map(response => Object.keys(response.data.data).map(key => response.data.data[key]));
        const tickerDtos = [].concat(...tickerDtoBatches);

        return tickerDtos.map(tickerDto => {
          return {
            id: tickerDto.id, 
            name: tickerDto.name,
            symbol: tickerDto.symbol,
            websiteSlug: tickerDto.website_slug, 
            rank: tickerDto.rank,
            priceUsd: parseFloat(tickerDto.quotes.USD.price) || 0,
            percentChange1h: parseFloat(tickerDto.quotes.USD.percent_change_1h) || 0,
            percentChange24h: parseFloat(tickerDto.quotes.USD.percent_change_24h) || 0,
            percentChange7d: parseFloat(tickerDto.quotes.USD.percent_change_7d) || 0,
            volume24h: parseFloat(tickerDto.quotes.USD['volume_24h']) || 0,
            marketCapUsd: parseFloat(tickerDto.quotes.USD.market_cap) || 0
          };
        });
      });
  }

  getMarkets(coinId, websiteSlug){    
    console.log(`Getting markets for ${websiteSlug} from Coinmarketcap`);

    return axios.get(`https://coinmarketcap.com/currencies/${websiteSlug}/`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const exchangeRows = $('#markets-table').find('td:nth-child(2)').slice(0, 10);
        const tradedPairRows = $('#markets-table').find('td:nth-child(3) a').slice(0, 10);

        // Coinmarketcap links to 'basic' versions of trading charts.
        // We prefer the 'pro' version as they contain commonly using trading tools.
        // Convert the CMC results to 'pro' for our uses.
        const convertToPro = (url) => {
          const signatures = [{
            name: 'Binance',
            basic: 'binance.com/trade.',
            pro: 'binance.com/tradeDetail.'
          }, {
            name: 'Kucoin',
            basic: 'kucoin.com/#/trade/',
            pro: 'kucoin.com/#/trade.pro/'
          }];

          const signature = signatures.find(({ basic }) => url.includes(basic));
          return signature ? url.replace(signature.basic, signature.pro) : url;
        };

        // Note that this is CheeroJS' map not Array.prototype.map
        return tradedPairRows.map((index, element) => {
          return {
            rank: index,
            exchangeName: $(exchangeRows[index]).text(),
            name: $(element).text(),
            url: convertToPro($(element).attr('href')),
            coinId
          };
        }).get();
      })
      .catch(error => {
        console.error(`Failed to get market data from Coinmarketcap. Reason:`, error.message);
        return [];
      });
  }

};