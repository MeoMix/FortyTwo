const SellAction = require('../../src/sell/sellAction.js');
const moment = require('moment');

xdescribe(`SellAction`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const sellAction = new SellAction();

      expect(sellAction).not.to.be.null;
    });
  });

  xdescribe(`decreasePosition`, () => {
    it(`should do nothing if no position exists`, async () => {
      const positions = [];

      await positions.decrease(`BMC`, `MeoMix`, 20);

      expect(positions.length).to.equal(0);
    });

    it(`should do nothing if existing amount is too small`, async () => {
      const sellAction = new SellAction();
      const positions = [{ coinId: `BMC`, username: `MeoMix`, amount: 5, purchasedOn: moment().format('YYYY-MM-DD HH:mm:ss') }];

      await sellAction.decreasePosition(`BMC`, `MeoMix`, 20);

      expect(positions.length).to.equal(1);
    });

    it(`should decrease position if amount is smaller than exisiting position`, async () => {
      const sellAction = new SellAction();
      const positions = [{ id: 1, coinId: `BMC`, username: `MeoMix`, amount: 25, purchasedOn: moment().format('YYYY-MM-DD HH:mm:ss') }];
      await sellAction.decreasePosition(`BMC`, `MeoMix`, 20);

      expect(positions[0].amount).to.equal(5);
    });

    it(`should remove position if amount is equal to existing position`, async () => {
      const sellAction = new SellAction();
      const positions = [{ id: 2, coinId: `BMC`, username: `MeoMix`, amount: 20, purchasedOn: moment().format('YYYY-MM-DD HH:mm:ss') }];
      
      await sellAction.decreasePosition(`BMC`, `MeoMix`, 20);

      expect(positions.length).to.equal(0);
    });
  });
});