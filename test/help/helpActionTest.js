const HelpAction = require('../../src/help/helpAction.js');

describe(`HelpAction`, () => {

  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const helpAction = new HelpAction();

      expect(helpAction).not.to.be.null;
    });
  });

  describe(`validate`, () => {
    it(`should return an error if the query is unknown`, async () => {

    });
  });

  describe(`execute`, () => {
    it(`should return a result successfully when given valid data`, async () => {
      const helpAction = new HelpAction();
      
      const result = await helpAction.execute();
      expect(result.length).to.be.greaterThan(0);
    });
  });

});