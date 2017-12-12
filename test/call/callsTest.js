const Calls = require('../../src/call/calls.js');

describe(`Calls`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const calls = new Calls();

      expect(calls).not.to.be.null;
    });
  });

});