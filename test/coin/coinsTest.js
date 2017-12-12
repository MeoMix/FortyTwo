const Coins = require('../../src/coin/coins.js');

describe(`Coins`, () => {
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const coins = new Coins({ id: 1 });
  
      expect(coins[0].id).to.equal(1);
    });
  });

  describe(`get`, () => {
    it(`should return the coin matching the given id`, () => {
      const coins = new Coins({ id: 1 }, { id: 2, symbol: 'FOO' }, { id: 3 });

      expect(coins.get(2).symbol).to.equal('FOO');
    });
  });
  
});