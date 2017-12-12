const WatchAction = require('../../src/watch/watchAction.js');

describe(`WatchAction`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const watchAction = new WatchAction();

      expect(watchAction).not.to.be.null;
    });
  });

});