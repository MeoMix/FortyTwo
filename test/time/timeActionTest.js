const { expect } = require('chai');
const TimeAction = require('../../src/time/timeAction.js');

describe(`TimeAction`, () => {

  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const timeAction = new TimeAction();

      expect(timeAction).not.to.be.null;
    });
  });

  describe(`execute`, () => {
    it(`should return a result successfully when given valid data`, async () => {
      const timeAction = new TimeAction();
      
      const result = await timeAction.execute();
      expect(result.length).to.be.greaterThan(0);
    });
  });

});