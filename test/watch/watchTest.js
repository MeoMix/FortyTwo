const Watch = require('../../src/watch/watch.js');

describe(`Watch`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const watch = new Watch();

      expect(watch).not.to.be.null;
    });
  });

});