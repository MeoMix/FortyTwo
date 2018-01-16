const { getPercentChange, toFloat } = require('../common/utility.js');
const Table = require('../common/table.js');
const moment = require('moment');

// TODO: Add concept of pagination to seeing calls.
// Be able to show page number and total number of pages.
module.exports = class CallAction {

  constructor( { values = [], user = null, coin = null, flags = [], guildId = '' } = {}, coins, bot, callDao) {
    if(!coins || !coins.length) throw new Error(`CallAction expects coins`);
    if(!bot) throw new Error(`CallAction expects bot`);
    if(!callDao) throw new Error(`CallAction expects callDao`);

    this.values = values;
    this.user = user;
    this.guildId = guildId;
    this.coin = coin;
    this.flags = flags;
    this.coins = coins;
    this.bot = bot;
    this.callDao = callDao;

    this.price = values.length > 1 ? toFloat(values[1]) : 0;

    this.isDelete = flags.includes('D');
    this.isAll = flags.includes('A');
    this.isSelf = flags.includes('I');
  }

  async validate() {
    if (this.isDelete && !this.isAll && !this.coin) {
      return `No coin found.`;
    }

    if (!this.isDelete && this.coin) {
      if(this.values.length > 1 && this.price <= 0){
        return `Price must be greater than zero.`;
      }

      const call = await this.callDao.get(this.guildId, this.user.id, this.coinId);
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

    if(!this.coin){
      return this.isSelf ? await this._getSelfCalls() : await this._getAllCalls();
    }
    
    return await this._callCoin();
  }

  async _deleteAllCalls(){
    await this.callDao.removeByUserId(this.guildId, this.user.id);

    return `${this.user.username} **deleted all** their calls.`;
  }

  async _deleteCoinCall(){
    await this.callDao.remove(this.guildId, this.user.id, this.coin.id);

    return `${this.user.username} **deleted call** ${this.coin.symbol}.`;
  }

  async _callCoin(){
    const price = this.price || this.coin.price_btc;
    
    await this.callDao.create({
      guildId: this.guildId,
      userId: this.user.id,
      coinId: this.coin.id,
      price,
      calledOn: moment().format('YYYY-MM-DD HH:mm:ss')
    });

    return `${this.user.username} **called** ${this.coin.symbol} at ${price.toFixed(8)}`;
  }

  async _getSelfCalls(){
    const table = new Table(`Calls  •  ${this.user.username}`);
    table.setHeading([' ', 'Symbol', 'Price', '% Change', 'Called On']);

    const calls = await this.callDao.getByUserId(this.guildId, this.user.id, 15);
    for (const call of calls) {
      const coin = this.coins.get(call.coinId);
      const change = getPercentChange(coin.price_btc, call.price);
      table.addRow(table.getRows().length + 1, coin.symbol, call.price.toFixed(8), change, moment(call.calledOn).format('MM/DD HH:mm'));
    }

    return `${table}`;
  }

  async _getAllCalls(){
    const table = new Table(`Calls`);
    table.setHeading([' ', 'User', 'Coin', 'Price', '% Change', 'Called On']);

    const calls = await this.callDao.getAll(this.guildId, 15);
    for (const call of calls) {
      const coin = this.coins.get(call.coinId);

      if(coin) {
        const change = getPercentChange(coin.price_btc, call.price);
        const user = this.bot.getUser(call.userId);
        const username = user ? user.username : `Unknown`;
  
        table.addRow(table.getRows().length + 1, username, coin.symbol, call.price.toFixed(8), change, moment(call.calledOn).format('MM/DD HH:mm'));
      } else {
        console.warn(`Unknown coin ${call.coinId}`);
      }
    }

    return `${table}`;
  }

};