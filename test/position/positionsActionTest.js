const PositionsAction = require('../../src/position/positionsAction.js');

describe(`PositionsAction`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const positionsAction = new PositionsAction();

      expect(positionsAction).not.to.be.null;
    });
  });

});