const BittrexApi = require('../../src/common/bittrexApi.js');

describe(`BittrexApi`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const bittrexApi = new BittrexApi();

      expect(bittrexApi).not.to.be.null;
    });
  });

});