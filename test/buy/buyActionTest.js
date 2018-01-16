const BuyAction = require('../../src/buy/buyAction.js');
const Coin = require('../../src/coin/coin.js');

describe(`BuyAction`, () => {

  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const buyAction = new BuyAction({}, {});

      expect(buyAction).not.to.be.null;
    });
  });

  describe(`validate`, () => {
    it(`Should return an error if no coin exists`, async () => {
      const buyAction = new BuyAction({}, {});

      const error = await buyAction.validate({ values: ['200@.001']});
      expect(error).not.to.be.undefined;
    });

    it(`Should return an error if no amount exists`, async () => {
      const buyAction = new BuyAction({ coin: new Coin(), values: ['@.001'] }, {});

      const error = await buyAction.validate();
      expect(error).not.to.be.undefined;
    });

    it(`Should return an error if no price exists`, async () => {
      const buyAction = new BuyAction({ coin: new Coin(), values: ['200@'] }, {});

      const error = await buyAction.validate();
      expect(error).not.to.be.undefined;
    });

    it(`Should not error if given valid values`, async () => {
      const buyAction = new BuyAction({ coin: new Coin(), values: ['200@.001'] }, {});
      
      const error = await buyAction.validate();
      expect(error).not.to.be.undefined;
    });
  });

  describe(`execute`, () => {
    it(`should return a result successfully when given valid data`, async () => {
      const buyAction = new BuyAction({ coin: new Coin(), values: ['200@.001'] }, { positions: [] }, {});
      
      const result = await buyAction.execute();
      expect(result.length).to.be.greaterThan(0);
    });
  });

  xdescribe(`increasePosition`, () => {
    it(`it should add a new position if no match found`, async () => {
      const buyAction = new BuyAction({ coin: new Coin(), values: ['200@'] }, {
        get() { return null; },
        create() { return null; }
      });
      const positions = [];

      await buyAction.increasePosition(`BMC`, `MeoMix`, 10, 20);

      expect(positions[0].amount).to.equal(20);
    });

    it(`it should merge positions if a match is found`, async () => {
      const buyAction = new BuyAction({ coin: new Coin(), values: ['200@'] }, {});
      const positions = [];
      
      await buyAction.increase(`BMC`, `MeoMix`, 10, 20);
      await buyAction.increase(`BMC`, `MeoMix`, 10, 20);

      expect(positions.length).to.equal(1);
    });

    it(`it should average positions when merging a smaller price`, async () => {
      const buyAction = new BuyAction({ coin: new Coin(), values: ['200@'] }, {});
      const positions = [];

      await buyAction.increasePosition(`BMC`, `MeoMix`, 20, 20);
      await buyAction.increasePosition(`BMC`, `MeoMix`, 10, 20);

      expect(positions[0].amount).to.equal(40);
      expect(positions[0].price).to.equal(15);
    });

    it(`it should average positions when merging a larger price`, async () => {
      const buyAction = new BuyAction({ coin: new Coin(), values: ['200@'] }, {});
      const positions = [];

      await buyAction.increasePosition(`BMC`, `MeoMix`, 10, 20);
      await buyAction.increasePosition(`BMC`, `MeoMix`, 20, 20);

      expect(positions[0].amount).to.equal(40);
      expect(positions[0].price).to.equal(15);
    });
  });


});