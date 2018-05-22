const HelpCommand = require('../../src/help/helpCommand.js');

describe(`HelpCommand`, () => {

  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const helpCommand = new HelpCommand();

      expect(helpCommand).not.to.be.null;
    });
  });

  describe(`validate`, () => {
    it(`should return an error if the command is unknown`, async () => {
      const helpCommand = new HelpCommand({ values: ['cactus']});

      const error = await helpCommand.validate();
      expect(error).to.equal(`Unknown command: cactus.`);
    });

    it(`should not return an error if the command is known`, async () => {
      const helpCommand = new HelpCommand({ values: ['call']});

      const error = await helpCommand.validate();
      expect(error).to.be.undefined;
    });
  });

  describe(`execute`, () => {
    it(`should return an introduction message if given no commands`, async () => {
      const helpCommand = new HelpCommand();
      
      const result = await helpCommand.execute();
      expect(result.includes('Supported commands')).to.be.true;
    });

    it(`should return a help message if given a valid command`, async () => {
      const helpCommand = new HelpCommand({ values: ['call']});
      
      const result = await helpCommand.execute();
      expect(result.includes('Call a coin at a given price')).to.be.true;
    });
  });

});