const ChatCommandType = require('./chatCommandType.js');

module.exports = class ChatMessage {

  constructor({ user = null, words = [], channelId, guildId } = {}) {
    this.user = user;
    this.words = words;
    this.channelId = channelId;
    this.guildId = guildId;
    this.chatCommandType = this._getChatCommandType(words.length ? words.shift() : '');
    this.flags = words.filter(word => this._isCommand(word)).map(flag => flag.trim().toUpperCase().replace('-', ''));
    this.values = words.filter(word => !this._isCommand(word)).map(value => value.trim().toUpperCase());
  }

  _getChatCommandType(word) {
    switch (word.toUpperCase()) {
    case '!CALL':
    case '!CALLS':
      return ChatCommandType.Call;
    case '!CALC':
      return ChatCommandType.Calc;
    case '!COIN':
    case '!C':
      return ChatCommandType.CoinDetails;
    case '!WATCH':
    case '!W':
      return ChatCommandType.Watch;
    case '!?':
    case '!HELP':
      return ChatCommandType.Help;
    case '!TIME':
      return ChatCommandType.Time;
    case '!CALENDAR':
      return ChatCommandType.Calendar;
    case '!ADMIN':
      return ChatCommandType.Admin;
    case '!TIPJAR':
      return ChatCommandType.TipJar;
    default:
      return ChatCommandType.None;
    }
  }

  _isCommand(word) {
    return word.trim().startsWith('-');
  }

};