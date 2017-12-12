const BuyAction = require('../../src/buy/buyAction.js');
const Coin = require('../../src/coin/coin.js');
const Positions = require('../../src/position/positions.js');

describe(`BuyAction`, () => {

  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const buyAction = new BuyAction();

      expect(buyAction).not.to.be.null;
    });
  });

  describe(`validate`, () => {
    it(`Should return an error if no coin exists`, async () => {
      const buyAction = new BuyAction();

      const error = await buyAction.validate({ values: ['200@.001']});
      expect(error).not.to.be.undefined;
    });

    it(`Should return an error if no amount exists`, async () => {
      const buyAction = new BuyAction({ coin: new Coin(), values: ['@.001'] });

      const error = await buyAction.validate();
      expect(error).not.to.be.undefined;
    });

    it(`Should return an error if no price exists`, async () => {
      const buyAction = new BuyAction({ coin: new Coin(), values: ['200@'] });

      const error = await buyAction.validate();
      expect(error).not.to.be.undefined;
    });

    it(`Should not error if given valid values`, async () => {
      const buyAction = new BuyAction({ coin: new Coin(), values: ['200@.001'] });
      
      const error = await buyAction.validate();
      expect(error).not.to.be.undefined;
    });
  });

  describe(`execute`, () => {
    it(`should return a result successfully when given valid data`, async () => {
      const buyAction = new BuyAction({ coin: new Coin(), values: ['200@.001'] }, { positions: new Positions() });
      
      const result = await buyAction.execute();
      expect(result.length).to.be.greaterThan(0);
    });
  });

});