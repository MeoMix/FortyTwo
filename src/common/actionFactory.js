const BuyAction = require('../buy/buyAction.js');
const SellAction = require('../sell/sellAction.js');
const CoinDetailsAction = require('../coin/coinDetailsAction.js');
const PositionAction = require('../position/positionAction.js');
const PositionDao = require('../position/positionDao.js');
const CallAction = require('../call/callAction.js');
const CallDao = require('../call/callDao.js');
const WatchAction = require('../watch/watchAction.js');
const WatchDao = require('../watch/watchDao.js');
const CalcAction = require('../calc/calcAction.js');
const HelpAction = require('../help/helpAction.js');
const TimeAction = require('../time/timeAction.js');
const CalendarAction = require('../calendar/calendarAction.js');
const CalendarItemDao = require('../calendar/calendarItemDao.js');
const AdminAction = require('../admin/adminAction.js');
const QueryType = require('../query/queryType.js');
const ChannelDao = require('../channel/channelDao.js');
const TipJarAction = require('../tipJar/tipJarAction.js');

module.exports = class ActionFactory {

  constructor(query, coins, database, bot){    
    if(!query) throw new Error(`ActionFactory expects query`);
    if(!coins) throw new Error(`ActionFactory expects coins`);
    if(!database) throw new Error(`ActionFactory expects database`);
    if(!bot) throw new Error(`ActionFactory expects bot`);

    this.query = query;
    this.coins = coins;
    this.database = database;
    this.bot = bot;
  }

  getAction(){
    switch(this.query.type){
    case QueryType.CoinDetails:
      return this.getCoinDetailsAction();
    case QueryType.Position:
      return this.getPositionAction();
    case QueryType.Buy:
      return this.getBuyAction();
    case QueryType.Sell:
      return this.getSellAction();
    case QueryType.Call:
      return this.getCallAction();
    case QueryType.Watch:
      return this.getWatchAction();
    case QueryType.Calc:
      return this.getCalcAction();
    case QueryType.Help:
      return this.getHelpAction();
    case QueryType.Time:
      return this.getTimeAction();
    case QueryType.Calendar:
      return this.getCalendarAction();
    case QueryType.Admin:
      return this.getAdminAction();
    case QueryType.TipJar:
      return this.getTipJarAction();
    }
  }

  getCoinDetailsAction(){
    return new CoinDetailsAction(this.query, this.coins);
  }

  getPositionAction(){
    return new PositionAction(this.query, this.coins, new PositionDao(this.database));
  }

  getBuyAction(){
    return new BuyAction(this.query, new PositionDao(this.database));
  }

  getSellAction(){
    return new SellAction(this.query, new PositionDao(this.database));
  }

  getCallAction(){
    return new CallAction(this.query, this.coins, this.bot, new CallDao(this.database));
  }

  getWatchAction(){
    return new WatchAction(this.query, this.coins, this.bot, new WatchDao(this.database));
  }

  getCalcAction(){
    return new CalcAction(this.query, this.coins);
  }

  getHelpAction(){
    return new HelpAction(this.query);
  }

  getTimeAction(){
    return new TimeAction();
  }

  getCalendarAction(){
    return new CalendarAction(this.query, this.bot, new CalendarItemDao(this.database));
  }

  getAdminAction(){
    return new AdminAction(this.query, new ChannelDao(this.database));
  }

  getTipJarAction(){
    return new TipJarAction();
  }

};