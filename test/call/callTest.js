const { expect } = require('chai');
const Call = require('../../src/call/call.js');

describe(`Call`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const call = new Call();

      expect(call).not.to.be.null;
    });
  });

});