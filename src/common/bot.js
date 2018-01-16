const { prefixPlus } = require('./utility.js');
const Discord = require('discord.js');
const EventEmitter = require('events');
const logger = require('../common/logger.js');
const User = require('./user.js');

module.exports = class Bot extends EventEmitter {

  constructor(bitcoinCoin) {
    super(...arguments);
    
    this.bitcoinCoin = bitcoinCoin;
    this.client = new Discord.Client();
    this.client.on('ready', this.onReady.bind(this));
    this.client.on('message', message => this.onMessage(message));
  }

  // Establish a websocket connection from the client to Discord
  login() {
    // Pass a token which represents a proxy of the account used to log in
    this.client.login(process.env.DISCORD_TOKEN);
  }

  setGame(message){
    this.client.user.setGame(message);
  }

  onReady(){
    logger.info('Bot ready!');
    this.setGameMessage();
    this.bitcoinCoin.on('change:price_usd', () => this.setGameMessage());
  }

  setGameMessage(){
    const message = `BTC: ${this.bitcoinCoin.price_usd.toFixed(0)}, ${prefixPlus(this.bitcoinCoin.percent_change_24h.toFixed(2))}%`;
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
      this.emit('message', {
        channel: message.channel,
        guild: message.guild,
        user: new User({ id: message.author.id, username }),
        words
      });
    } catch (error) {
      logger.error(error);
      message.channel.send(error.message);
    }
  }

  sendMessage(channelId, message){
    const channel = this.client.channels.find('id', channelId);

    if(!channel){
      logger.warn(`Failed to find channel with id ${channelId}`);
      return;
    }

    channel.send(message);
  }

};