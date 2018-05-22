const ChatCommandType = require('./chatCommandType.js');

module.exports = class ChatCommandResponder {

  constructor(chatCommandFactory, coinDao){
    this.chatCommandFactory = chatCommandFactory;
    this.coinDao = coinDao;
  }

  startResponding(bot){
    bot.on('message', async message => {
      if(message.chatCommandType === ChatCommandType.None) return;

      const chatCommand = await this.chatCommandFactory.getChatCommand(message);
      const response = await this.getResponse(chatCommand);
      if(!response) return;
      
      await bot.respond(message.channelId, response);
    });
  }

  async getResponse(chatCommand){
    try {
      console.log('Message received');

      const validationError = chatCommand.validate ? await chatCommand.validate() : '';
      if (validationError) return validationError;

      return await chatCommand.execute();
    } catch (error) {
      console.error(error);
    }
  }

};