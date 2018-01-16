const PositionAction = require('../../src/position/positionAction.js');

describe(`PositionAction`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const positionDaoMock = {};
      const positionAction = new PositionAction({}, [{}], positionDaoMock);

      expect(positionAction).not.to.be.null;
    });
  });

});