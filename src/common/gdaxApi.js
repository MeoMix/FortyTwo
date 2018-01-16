const Gdax = require('gdax');

module.exports = class GdaxApi {

  // Get a list of available currency pairs for trading.
  /*
    [
      {
          "id": "BTC-USD",
          "base_currency": "BTC",
          "quote_currency": "USD",
          "base_min_size": "0.01",
          "base_max_size": "10000.00",
          "quote_increment": "0.01"
      }
  ]
  */
  async getProducts(){
    try {
      const publicClient = new Gdax.PublicClient();
      const response = await publicClient.getProducts();

      if(response && response.message){
        console.error(`Error encountered when calling getProductTicker.`, response.message);
        return;
      } else {
        return response;
      }
    } catch(error){
      console.error(error);
    }
  }

  // Snapshot information about the last trade (tick), best bid/ask and 24h volume.
  // NOTE: Polling is discouraged in favor of connecting via the websocket stream and listening for match messages.
  /*
    {
      "trade_id": 4729088,
      "price": "333.99",
      "size": "0.193",
      "bid": "333.98",
      "ask": "333.99",
      "volume": "5957.11914015",
      "time": "2015-11-14T20:46:03.511254Z"
    }
  */
  async getProductTicker(productId){
    try {      
      const publicClient = new Gdax.PublicClient(productId);
      const response = await publicClient.getProductTicker();

      if(response && response.message){
        console.error(`Error encountered when calling getProductTicker.`, response.message);
        return;
      } else {
        return response;
      }
    } catch(error){
      console.error(error);
    }
  }

};