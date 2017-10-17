const { expect } = require('chai');
const CoinmarketcapApi = require('../../src/common/coinmarketcapApi.js');

describe(`CoinmarketcapApi`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const coinmarketcapApi = new CoinmarketcapApi();

      expect(coinmarketcapApi).not.to.be.null;
    });
  });

});