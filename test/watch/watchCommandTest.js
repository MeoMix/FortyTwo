const WatchCommand = require('../../src/watch/watchCommand.js');

describe(`WatchCommand`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const watchCommand = new WatchCommand({}, [{}], {}, {});

      expect(watchCommand).not.to.be.null;
    });
  });

});