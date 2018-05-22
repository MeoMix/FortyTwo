const Batch = require('batch');
const Cache = require('./cache.js');

const cache = new Cache();

// Ask cmc's api for the latest information on all tracked coins.
// Persist the retrieved data to the 'coin' database table.
exports.updateCoins = (req, res) => {
  cache.database.connect()
    .then(cache.coinmarketcapApi.getTickers)
    .then(tickerDtos => {
      console.log(`Received ${tickerDtos.length} ticker${tickerDtos.length === 1 ? '' : 's'}`);
      const coins = tickerDtos.map(({ id, name, symbol, websiteSlug, rank, priceUsd, percentChange1h, percentChange24h, percentChange7d, volume24h, marketCapUsd }) => {
        return { id, name, symbol, websiteSlug, rank, priceUsd, percentChange1h, percentChange24h, percentChange7d, volume24h, marketCapUsd };
      });

      console.log(`Writing to database`);
      return cache.database.coinDefinition.bulkCreate(coins, { updateOnDuplicate: true })
        .catch(error => {
          console.error(`Bulk create/update of coin${coins.length === 1 ? '' : 's'} failed. Reason:`, error);
          throw error;
        });
    })
    .then(coins => {
      console.log(`Successfully updated ${coins.length} coin${coins.length === 1 ? '' : 's'}`);
      res.status(200).end(`Successfully updated ${coins.length} coin${coins.length === 1 ? '' : 's'}`);
    })
    .catch(error => {
      console.error(error);
      res.status(500).end();
    });
};

// Scrape the market information for all of cmc's coins from their
// website. Be careful with how quickly the information is retrieved.
// Since there are 1400+ coins it is possible to overload cmc's server
// and have the connection reset. So, only allow 10 requests to be in flight
// at a given time. Persist the retrieved data to the 'market' database table.
// NOTE: This function will take ~4 minutes to execute when deployed. The default timeout
// of a GCF is lower than 4 minutes. Be sure to check the timeout if this method stops working.
exports.updateMarkets = (req, res) => {
  cache.database.connect()
    .then(() => {
      return cache.database.coinDefinition.findAll().catch(error => {
        console.error(`Failed to get coins from database. Reason:`, error.message);
        throw error;
      });
    })
    .then(coinDtos => {
      return new Promise((resolve, reject) => {
        console.log(`Creating Batch of requests`);
        const batch = new Batch(...coinDtos.map(({ id, websiteSlug }) => (done) => {
          cache.coinmarketcapApi.getMarkets(id, websiteSlug)
            .then(markets => done(null, markets))
            .catch(error => done(error));
        }));
        // 50 is arbitrary. Just don't get blocked out by the CMC server.
        batch.concurrency(50);
        batch.on('progress', ({ pending, total, percent }) => {
          console.log(`progress`, { pending, total, percent });
        });

        // TODO: Probably better to write to the database during progress rather than during 'end' so DB doesn't lock due to large insert.
        console.log(`Issuing requests`);
        batch.end((errors, marketLists) => {
          if(errors && errors.length){
            console.error(`Encountered errors during batch process:`, errors);
            reject(errors);
          } else {
            // Flatten 2d array of markets-per-coin to an array of all markets.
            const marketDtos = [].concat(...marketLists);
            console.log(`Received ${marketDtos.length} market${marketDtos.length === 1 ? '' : 's'} for ${marketLists.length} coin${marketLists.length === 1 ? '' : 's'}`);
            const markets = marketDtos.map(({ name, exchangeName, rank, url, coinId }) => {
              return { name, exchangeName, rank, url, coinId };
            });
    
            console.log(`Writing to database`);
            resolve(cache.database.marketDefinition.bulkCreate(markets, { updateOnDuplicate: true }).catch(error => {
              console.error(`Bulk create/update of market${markets.length === 1 ? '' : 's'} failed. Reason:`, error);
              throw error;
            }));
          }
        });
      });
    })
    .then(markets => {
      console.log(`Successfully updated ${markets.length} market${markets.length === 1 ? '' : 's'}`);
      res.status(200).end();
    })
    .catch((error) => {
      console.error(`Erroring out`, error);
      res.status(500).end();
    });
};

// Ask gdax's api for the latest information on LTC, ETH, and BTC.
// Persist the retrieved data to the 'gdax' database table.
exports.updateGdax = (req, res) => {
  cache.database.connect()
    .then(() => {
      return Promise.all(['LTC', 'ETH', 'BTC'].map(symbol => cache.gdaxApi.getProductTicker(symbol, `USD`))).catch(error => {
        console.error(`Failed to get GDAX product tickers from API. Reason:`, error.message);
        throw error;
      });
    })
    .then(tickerDtos => {
      console.log(`Received ${tickerDtos.length} ticker${tickerDtos.length === 1 ? '' : 's'}`);
      const tickers = tickerDtos.map(({ id, symbol, price }) => {
        return { id, symbol, price };
      });

      console.log(`Writing to database`);
      return cache.database.gdaxDefinition.bulkCreate(tickers, { updateOnDuplicate: true }).catch(error => {
        console.error(`Bulk create/update of ticker${tickers.length === 1 ? '' : 's'} failed. Reason:`, error);
        throw error;
      });
    })
    .then(tickers => {
      console.log(`Successfully updated ${tickers.length} ticker${tickers.length === 1 ? '' : 's'}`);
      res.status(200).end();
    })
    .catch(() => res.status(500).end());
};