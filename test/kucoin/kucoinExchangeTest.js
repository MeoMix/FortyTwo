const KucoinExchange = require('../../src/kucoin/kucoinExchange.js');

describe(`KucoinExchange`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const exchange = new KucoinExchange();
      expect(exchange.name).to.equal('Kucoin');
    });
  });

});