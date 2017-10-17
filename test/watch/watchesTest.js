const { expect } = require('chai');
const Watches = require('../../src/watch/watches.js');

describe(`Watches`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const watches = new Watches();

      expect(watches).not.to.be.null;
    });
  });

});