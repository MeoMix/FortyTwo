const CoinDetailsCommand = require('../coin/coinDetailsCommand.js');
const CoinDao = require('../coin/coinDao.js');
const CallCommand = require('../call/callCommand.js');
const CallDao = require('../call/callDao.js');
const WatchCommand = require('../watch/watchCommand.js');
const WatchDao = require('../watch/watchDao.js');
const CalcCommand = require('../calc/calcCommand.js');
const HelpCommand = require('../help/helpCommand.js');
const TimeCommand = require('../time/timeCommand.js');
const CalendarCommand = require('../calendar/calendarCommand.js');
const CalendarItemDao = require('../calendar/calendarItemDao.js');
const AdminCommand = require('../admin/adminCommand.js');
const ChatCommandType = require('./chatCommandType.js');
const ChannelDao = require('../channel/channelDao.js');
const TipJarCommand = require('../tipJar/tipJarCommand.js');

module.exports = class ChatCommandFactory {

  constructor(database, bot, browser){    
    if(!database) throw new Error(`ChatCommandFactory expects database`);
    if(!bot) throw new Error(`ChatCommandFactory expects bot`);

    this.database = database;
    this.bot = bot;
    this.browser = browser;
  }

  async getChatCommand(message){
    switch(message.chatCommandType){
    case ChatCommandType.CoinDetails:
      return await this.getCoinDetailsCommand(message);
    case ChatCommandType.Call:
      return await this.getCallCommand(message);
    case ChatCommandType.Watch:
      return await this.getWatchCommand(message);
    case ChatCommandType.Calc:
      return this.getCalcCommand(message);
    case ChatCommandType.Help:
      return this.getHelpCommand(message);
    case ChatCommandType.Time:
      return this.getTimeCommand();
    case ChatCommandType.Calendar:
      return this.getCalendarCommand(message);
    case ChatCommandType.Admin:
      return this.getAdminCommand(message);
    case ChatCommandType.TipJar:
      return this.getTipJarCommand();
    }
  }

  async getCoinDetailsCommand(chatMessage){
    const coinDao = new CoinDao(this.database);
    const coins = await coinDao.getByMessage(chatMessage);
    
    return new CoinDetailsCommand(chatMessage, coins, coinDao, this.browser);
  }

  async getCallCommand(chatMessage){
    const coinDao = new CoinDao(this.database);
    const coins = await coinDao.getByMessage(chatMessage);
    const coin = coins ? coins[0] : undefined;

    return new CallCommand(chatMessage, coin, this.bot, new CallDao(this.database), coinDao);
  }

  async getWatchCommand(chatMessage){    
    const coinDao = new CoinDao(this.database);
    const coins = await coinDao.getByMessage(chatMessage);
    const coin = coins ? coins[0] : undefined;

    return new WatchCommand(chatMessage, coin, this.bot, new WatchDao(this.database));
  }

  getCalcCommand(chatMessage){
    return new CalcCommand(chatMessage, new CoinDao(this.database));
  }

  getHelpCommand(chatMessage){
    return new HelpCommand(chatMessage);
  }

  getTimeCommand(){
    return new TimeCommand();
  }

  getCalendarCommand(chatMessage){
    return new CalendarCommand(chatMessage, this.bot, new CalendarItemDao(this.database));
  }

  getAdminCommand(chatMessage){
    return new AdminCommand(chatMessage, new ChannelDao(this.database));
  }

  getTipJarCommand(){
    return new TipJarCommand();
  }

};