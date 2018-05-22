const { pickBy, groupBy, values } = require('lodash');
const CoinmarketcapApi = require('../../src/coinmarketcap/coinmarketcapApi.js');

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

  describe(`getMarkets`, () => {
    it(`should return a list of markets based on coinId`, async () => {
      const coinmarketcapApi = new CoinmarketcapApi();
      
      const markets = await coinmarketcapApi.getMarkets(`walton`);
  
      expect(markets.length).to.be.greaterThan(0);
    });
  });

});