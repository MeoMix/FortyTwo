const TimeCommand = require('../../src/time/timeCommand.js');

describe(`TimeCommand`, () => {

  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const timeCommand = new TimeCommand();

      expect(timeCommand).not.to.be.null;
    });
  });

  describe(`execute`, () => {
    it(`should return a result successfully when given valid data`, async () => {
      const timeCommand = new TimeCommand();
      
      const result = await timeCommand.execute();
      expect(result.length).to.be.greaterThan(0);
    });
  });

});