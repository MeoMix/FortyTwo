const ChatMessage = require('../../src/chat/chatMessage.js');

describe(`ChatMessage`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const chatMessage = new ChatMessage();

      expect(chatMessage).not.to.be.null;
    });
  });

});