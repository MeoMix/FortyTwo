const CoinDetailsView = require('../../src/coin/coinDetailsView.js');
const Coin = require('../../src/coin/coin.js');

describe(`CoinDetailsView`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const coinDetailsView = new CoinDetailsView({
        coins: [new Coin()],
        bitcoin: new Coin()
      });
      
      expect(coinDetailsView).to.exist;
    });
  });

  describe(`render`, () => {
    it(`should return an embeddable object to represent a single coins' full details`, () => {
      const coinDetailsView = new CoinDetailsView({
        coins: [new Coin()],
        bitcoin: new Coin()
      });
      
      const result = coinDetailsView.render();

      expect(result.embed).to.exist;
    });
  });

});