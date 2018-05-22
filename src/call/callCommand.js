const { getPercentChange, getPercentChangeLabel, toFloat } = require('../common/utility.js');
const Table = require('../common/table.js');
const moment = require('moment');
const { orderBy } = require('lodash');

// TODO: Add concept of pagination to seeing calls.
// Be able to show page number and total number of pages.
module.exports = class CallCommand {

  constructor( { values = [], user = null, flags = [], guildId = '' } = {}, coin, bot, callDao, coinDao) {
    if(!bot) throw new Error(`CallCommand expects bot`);
    if(!callDao) throw new Error(`CallCommand expects callDao`);
    if(!coinDao) throw new Error(`CallCommand expects coinDao`);

    this.values = values;
    this.user = user;
    this.guildId = guildId;
    this.coin = coin;
    this.flags = flags;
    this.bot = bot; 
    this.callDao = callDao;
    this.coinDao = coinDao;

    this.price = values.length > 1 ? toFloat(values[1]) : 0;

    this.isDelete = flags.includes('D');
    this.isAll = flags.includes('A');
    // TODO: Do I want to make this fully dynamic?
    this.is1D = flags.includes('1D');
    this.is7D = flags.includes('7D');
    this.is30D = flags.includes('30D');
    this.is90D = flags.includes('90D');
    this.isSelf = flags.includes('I');
  }

  // TODO: Add is1D is7D is30D validation and help
  async validate() {
    if (this.isDelete && !this.isAll && !this.coin) {
      return `No coin found.`;
    }

    if (!this.isDelete && this.coin) {
      if(this.values.length > 1 && this.price <= 0){
        return `Price must be greater than zero.`;
      }

      const call = await this.callDao.get(this.guildId, this.user.id, this.coin.id);
      if(call){
        return `You are already calling ${this.coin.symbol}.`;
      }
    }
  }

  async execute() {
    if(this.isDelete){
      if(this.isAll){
        return await this._deleteAllCalls();
      } else if(this.coin){
        return await this._deleteCoinCall();
      }
      throw new Error(`Unhandled state. Deletion expects a coin or the delete all flag.`);
    }

    const bitcoin = await this.coinDao.get(1);

    if(!this.coin){
      if(this.isSelf){
        return await this._getSelfCalls(bitcoin);
      }

      const dayRange = this.is1D ? 1 : this.is30D ? 30 : this.is90D ? 90 : 7;
      return await this._getCallsWithinRange(dayRange, bitcoin);
    }
    
    return await this._callCoin(bitcoin);
  }

  async _deleteAllCalls(){
    await this.callDao.removeByUserId(this.guildId, this.user.id);

    return `${this.user.username} **deleted all** their calls.`;
  }

  async _deleteCoinCall(){
    await this.callDao.remove(this.guildId, this.user.id, this.coin.id);

    return `${this.user.username} **deleted call** ${this.coin.symbol}.`;
  }

  async _callCoin(bitcoin){
    const priceBtc = this.coin.price_usd / bitcoin.price_usd;
    const price = this.price || priceBtc;
    
    await this.callDao.create({
      guildId: this.guildId,
      userId: this.user.id,
      // TODO: Calls in DB are currently websiteSlug not id. Will need to write a script to adjust.
      coinId: this.coin.id,
      price,
      calledOn: moment().format('YYYY-MM-DD HH:mm:ss')
    });

    return {
      message: `${this.user.username} **called** ${this.coin.symbol} at ${price.toFixed(8)}`,
      reactions: [`👍`, `👎`]
    };
  }

  async _getSelfCalls(bitcoin){
    const table = new Table(`Calls  •  ${this.user.username}`);
    table.setHeading([' ', 'Symbol', 'Price', '% Change', 'Called On']);

    // TODO: I can remove the '15' limit here if I enable split messaging on bot sending messages to Discord.
    const calls = await this.callDao.getByUserId(this.guildId, this.user.id, 15);
    for (const call of calls) {
      const priceBtc = call.coin.price_usd / bitcoin.price_usd;
      const change = getPercentChangeLabel(priceBtc, call.price);
      table.addRow(table.getRows().length + 1, call.coin.symbol, call.price.toFixed(8), change, moment(call.calledOn).format('MM/DD HH:mm'));
    }

    return `${table}`;
  }

  async _getCallsWithinRange(daysInRange, bitcoin){
    const calls = await this.callDao.getWithinDateRange(this.guildId, moment().subtract(daysInRange, 'days'), moment(), 15);
    const bestCalls = orderBy(calls, call => {
      const priceBtc = call.coin.price_usd / bitcoin.price_usd;
      return getPercentChange(priceBtc, call.price);
    }, 'desc');

    return await this._getCallsTable(`Best Calls • Past ${daysInRange} day${daysInRange === 1 ? '' : 's'}`, bestCalls, bitcoin);
  }

  async _getCallsTable(tableName, calls, bitcoin){
    const table = new Table(tableName);
    table.setHeading([' ', 'User', 'Coin', 'Price', '% Change', 'Called On']);

    for (const call of calls) {
      const priceBtc = call.coin.price_usd / bitcoin.price_usd;
      const change = getPercentChangeLabel(priceBtc, call.price);
      const user = this.bot.getUser(call.userId);
      const username = user ? user.username : `Unknown`;

      table.addRow(table.getRows().length + 1, username, call.coin.symbol, call.price.toFixed(8), change, moment(call.calledOn).format('MM/DD HH:mm'));
    }

    return `${table}`;
  }

};