const { prefixPlus } = require('./utility.js');
const Discord = require('discord.js');
const EventEmitter = require('events');

module.exports = class Bot extends EventEmitter {

  constructor(bitcoinCoin) {
    super(...arguments);
    
    this.bitcoinCoin = bitcoinCoin;
    this.bot = new Discord.Client();
    this.token = 'MzYzNTU1ODk0NzQ0NTgwMTE3.DLDFLA.oj__4cBfaAZ1DBfQlTVI2JGuutc';
    this.bot.on('ready', this.onReady.bind(this));
    this.bot.on('message', message => this.onMessage(message));
  }

  login() {
    this.bot.login(this.token);
  }

  setGame(message){
    this.bot.user.setGame(message);
  }

  onReady(){
    this.setGameMessage();
    this.bitcoinCoin.on('change:price_usd', () => this.setGameMessage());
  }

  setGameMessage(){
    const message = `BTC: ${this.bitcoinCoin.price_usd.toFixed(0)}, ${prefixPlus(this.bitcoinCoin.percent_change_24h.toFixed(2))}%`;
    this.bot.user.setGame(message);
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
        username,
        userId: message.author.id,
        words
      });
    } catch (error) {
      console.error(error);
      message.channel.send(error.message);
    }
  }

};