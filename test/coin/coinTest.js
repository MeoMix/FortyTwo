const { expect } = require('chai');
const Coin = require('../../src/coin/coin.js');

describe(`Coin`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const coin = new Coin();

      expect(coin).not.to.be.null;
    });
  });

  describe(`setter`, () => {
    it(`should emit event when property value changes`, (done) => {
      const coin = new Coin();

      coin.on('change:name', name => {
        expect(coin.name).to.equal(name);
        done();
      });
      
      coin.name = 'Foo';
    });
  });

});