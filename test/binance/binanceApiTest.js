const BinanceApi = require('../../src/binance/binanceApi.js');

describe(`BinanceApi`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const binanceApi = new BinanceApi();

      expect(binanceApi).not.to.be.null;
    });
  });

  describe(`getMarkets`, () => {
    it(`should return binance markets`, async () => {
      const binanceApi = new BinanceApi();
      const markets = await binanceApi.getMarkets();

      expect(markets.length).to.be.greaterThan(0);
    }).timeout(10000);
  });

});