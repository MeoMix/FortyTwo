const { pickBy, groupBy, values } = require('lodash');
const CoinmarketcapApi = require('../../src/common/coinmarketcapApi.js');

describe(`CoinmarketcapApi`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const coinmarketcapApi = new CoinmarketcapApi();

      expect(coinmarketcapApi).not.to.be.null;
    });
  });

  describe(`getTickers`, () => {
    it(`should ensure symbol uniqueness by filtering low volume coins`, async () => {
      const coinmarketcapApi = new CoinmarketcapApi();

      const tickers = await coinmarketcapApi.getTickers();
      const duplicateTickerSets = values(pickBy(groupBy(tickers, 'symbol'), group => group.length > 1));
      expect(duplicateTickerSets.length).to.equal(0);
    });
  });

  describe(`getExchanges`, () => {
    it(`should return a list of exchanges based on coinId`, async () => {
      const coinmarketcapApi = new CoinmarketcapApi();
      
      const exchanges = await coinmarketcapApi.getExchanges(`walton`);
  
      expect(exchanges.length).to.be.greaterThan(0);
    });
  });

});