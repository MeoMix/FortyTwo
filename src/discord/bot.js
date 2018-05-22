const { prefixPlus } = require('../common/utility.js');
const { omit } = require('lodash');
const User = require('../user/user.js');
const ChatMessage = require('../chat/chatMessage.js');
const EventEmitter = require('events');

module.exports = class Bot extends EventEmitter {

  constructor(coinDao, client, discordToken) {
    super(...arguments);

    this.coinDao = coinDao;
    this.client = client;
    this.discordToken = discordToken;
    this.client.on('ready', async () => await this.onReady());
    this.client.on('message', message => this.onMessage(message));
  }

  // Establish a websocket connection from the client to Discord
  login() {
    // Pass a token which represents a proxy of the account used to log in
    this.client.login(this.discordToken);
  }

  setGame(message){
    this.client.user.setGame(message);
  }

  async onReady(){
    console.log('Bot ready!');
    await this.setGameMessage();
    setInterval(async () => { await this.setGameMessage(); }, 60000);
  }

  async setGameMessage(){
    const bitcoin = await this.coinDao.get(1);
    const message = `BTC: ${bitcoin.price_usd.toFixed(0)}, ${prefixPlus(bitcoin.percent_change_24h.toFixed(2))}%`;
    this.client.user.setGame(message);
  }

  getUser(userId){
    return this.client.users.get(userId);
  }

  onMessage(message) {
    // Bot should not reply to itself.
    if (message.author.bot) return;

    // Safe-guard against odd Discord state.
    const username = message.author ? message.author.username : '';
    if (!username.length) return;

    const words = message.content ? message.content.trim().split(' ') : [];
    if (!words.length) return;

    try {
      this.emit('message', new ChatMessage({
        channelId: message.channel ? message.channel.id : '',
        guildId: message.guild ? message.guild.id : '',
        user: new User({ id: message.author.id, username }),
        words
      }));
    } catch (error) {
      console.error(error);
    }
  }

  async respond(channelId, response){
    const channel = this.client.channels.find('id', channelId);

    if(!channel){
      console.warn(`Failed to find channel with id ${channelId}`);
      return;
    }

    // TODO: Sloppy way of extracting 'message' from 3 different format types
    const message = response.message ? response.message : response.reactions ? omit(response, 'reactions') : response;
    const sentMessage = await channel.send(message);

    if(response.reactions){
      await Promise.all(response.reactions.map(reaction => sentMessage.react(reaction)));
    }

    return sentMessage;
  }

};