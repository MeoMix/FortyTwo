const CallAction = require('../../src/call/callAction.js');

describe(`CallAction`, () => {

  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const callAction = new CallAction();

      expect(callAction).not.to.be.null;
    });
  });

  describe(`validate`, () => {
    it(`should error when deleting without a coin or the 'delete all' flag`, async () => {
    });

    it(`should error when calling with a price of zero`, async () => {

    });

    it(`should error when calling with a negative price`, async () => {

    });

    it(`should error if coin is already called`, async () => {

    });
  });

});