const Gdax = require('gdax');

module.exports = class GdaxApi {

  constructor(){
    this.publicClient = new Gdax.PublicClient();
  }

  // Get a list of available currency pairs for trading.
  // [{ id: 'BTC-USD', base_currency: 'BTC', quote_currency: 'USD', base_min_size: '0.01', base_max_size: '10000.00', quote_increment: '0.01' }]
  getProducts(){
    console.log(`Getting GDAX products`);

    return this.publicClient.getProducts()
      .then(response => {
        if(response && response.message){
          console.error(`Error in getProducts:`, response.message);
          throw new Error(response.message);
        }

        return response;
      })
      .catch(error => {
        console.error(`Error in getProducts:`, error);
        throw error;
      });
  }

  // Snapshot information about the last trade (tick), best bid/ask and 24h volume.
  // NOTE: Polling is discouraged in favor of connecting via the websocket stream and listening for match messages.
  // { trade_id: 4729088, price: '333.99', size: '0.193', bid: '333.98', ask: '333.99', volume: '5957.11914015', time: '2015-11-14T20:46:03.511254Z' }
  getProductTicker(symbol, baseSymbol){
    console.log(`Getting GDAX product tickers for ${symbol}-${baseSymbol}`);

    return this.publicClient.getProductTicker(`${symbol}-${baseSymbol}`)
      .then(response => {
        if(response && response.message){
          console.error(`Error in getProductTicker`, response.message);
          throw new Error(response.message);
        }

        return Object.assign({ symbol, baseSymbol }, response);
      })
      .catch(error => {
        console.error(`Error in getProductTicker`, error);
        throw error;
      });
  }

};