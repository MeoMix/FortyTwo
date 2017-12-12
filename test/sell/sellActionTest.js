const SellAction = require('../../src/sell/sellAction.js');

describe(`SellAction`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const sellAction = new SellAction();

      expect(sellAction).not.to.be.null;
    });
  });

});