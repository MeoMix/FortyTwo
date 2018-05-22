const KucoinApi = require('../../src/kucoin/kucoinApi.js');

describe(`KucoinApi`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const kucoinApi = new KucoinApi();

      expect(kucoinApi).not.to.be.null;
    });
  });

  describe(`getMarkets`, () => {
    it(`should return kucoin markets`, async () => {
      const kucoinApi = new KucoinApi();
      const markets = await kucoinApi.getMarkets();

      expect(markets.length).to.be.greaterThan(0);
    }).timeout(10000);
  });

});