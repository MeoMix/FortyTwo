const { getPercentChange, toFloat } = require('../common/utility.js');
const QueryType = require('../query/queryType.js');
const Table = require('../common/table.js');
const { filter, takeRight } = require('lodash');
const moment = require('moment');

module.exports = class CallAction {

  constructor( { values = [], username = '', coin = null, flags = [] } = {}, { calls = null, coins = null } = {}) {
    this.values = values;
    this.username = username;
    this.coin = coin;
    this.flags = flags;
    this.calls = calls;
    this.coins = coins;

    this.price = values.length > 1 ? toFloat(values[1]) : 0;

    this.isDelete = flags.includes('D');
    this.isAll = flags.includes('A');
    this.isSelf = flags.includes('I');
  }

  static get type() { return QueryType.Call; }

  async validate() {
    if (this.isDelete && !this.isAll && !this.coin) {
      return `No coin found.`;
    }

    if (!this.isDelete && this.coin) {
      if(this.values.length > 1 && this.price <= 0){
        return `Price must be greater than zero.`;
      }

      if(this.calls.get(this.coin.id, this.username)){
        return `You are already calling ${this.coin.symbol}`;
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
      return this.isSelf ? this._getSelfCalls() : this._getAllCalls();
    }
    
    return await this._callCoin();
  }

  async _deleteAllCalls(){
    await this.calls.removeByUsername(this.username);
    return `${this.username} **deleted all** their calls.`;
  }

  async _deleteCoinCall(){
    await this.calls.remove(this.username, this.coin.id);
    return `${this.username} **deleted call** ${this.coin.symbol}.`;
  }

  async _callCoin(){
    const price = this.price || this.coin.price_btc;
    
    await this.calls.add({
      username: this.username,
      coinId: this.coin.id,
      price,
      calledOn: moment().format('YYYY-MM-DD HH:mm:ss')
    });

    return `${this.username} **called** ${this.coin.symbol} at ${price.toFixed(8)}`;
  }

  _getSelfCalls(){
    const table = new Table(`Calls  •  ${this.username}`);
    table.setHeading([' ', 'Symbol', 'Price', '% Change', 'Called On']);

    for (const call of filter(this.calls, { username: this.username })) {
      const coin = this.coins.get(call.coinId);
      const change = getPercentChange(coin.price_btc, call.price);
      table.addRow(table.getRows().length + 1, coin.symbol, call.price.toFixed(8), change, moment(call.calledOn).format('MM/DD HH:mm'));
    }

    return `${table}`;
  }

  _getAllCalls(){
    const table = new Table(`Calls`);
    table.setHeading([' ', 'User', 'Coin', 'Price', '% Change', 'Called On']);

    for (const call of takeRight(this.calls, 15)) {
      const coin = this.coins.get(call.coinId);
      const change = getPercentChange(coin.price_btc, call.price);
      table.addRow(table.getRows().length + 1, call.username, coin.symbol, call.price.toFixed(8), change, moment(call.calledOn).format('MM/DD HH:mm'));
    }

    return `${table}`;
  }

};