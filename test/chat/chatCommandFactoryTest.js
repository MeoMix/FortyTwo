const ChatCommandFactory = require('../../src/chat/chatCommandFactory.js');

describe(`ChatCommandFactory`, () => {

  it(`should instantiate`, () => {
    const chatCommandFactory = new ChatCommandFactory({}, {}, {}, {});

    expect(chatCommandFactory).to.exist;
  });

});