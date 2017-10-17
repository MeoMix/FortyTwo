
const QueryType = require('../query/queryType.js');
const { toFloat } = require('../common/utility.js');

module.exports = class SellAction {

  constructor({ values = [], username = '', coin = null, flags = [] } = {}, { positions = null } = {}) {
    this.values = values;
    this.username = username;
    this.coin = coin;
    this.flags = flags;
    this.positions = positions;

    this.amount = values.length > 1 ? toFloat(values[1]) : 0;
    this.isAll = flags.includes('A');
  }

  static get type() { return QueryType.Sell; }

  async validate() {
    if (!this.coin) {
      return `Can't sell. No matching coin found `;
    }

    const position = this.positions.get(this.coin.id, this.username);
    if (!position) {
      return `Can't sell. You don't own any ${this.coin.symbol}.`;
    }

    if (!this.isAll) {
      if (!this.amount) {
        return 'Invalid query. Expected an amount to sell.';
      }

      const totalAmount = position ? position.amount : 0;
      if (this.amount > totalAmount) {
        return `Can't sell ${this.amount} ${this.coin.symbol}. You own ${totalAmount}`;
      }
    }
  }

  async execute() {
    let result;
    if (this.isAll) {
      result = await this.positions.remove(this.coin.id, this.username);
    } else {
      result = await this.positions.decrease(this.coin.id, this.username, this.amount);
    }

    if (result.amount) {
      return `${this.username} **sells** ${result.amount.toFixed(4)} ${this.coin.symbol}!`;
    } else {
      return `Sell failed. Reason: ${result.error}`;
    }
  }

};