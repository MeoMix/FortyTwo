const QueryType = require('../query/queryType.js');
const { toFloat } = require('../common/utility.js');

// TODO: This assumes Bitcoin, but that doesn't really allow for other pairs to be traded.
// TODO: Prefer not needing the @ symbol and intelligently determining the values based on market prices.
module.exports = class BuyAction {

  constructor({ username = '', coin = null, values = [] } = {}, { positions = null } = {}) {
    this.username = username;
    this.coin = coin;
    this.values = values;
    this.positions = positions;

    if(values.length > 1){
      const amountAndPrice = values[1].split('@');
      this.amount = toFloat(amountAndPrice[0]);
      this.price = toFloat(amountAndPrice[1]);
    } else {
      this.amount = 0;
      this.price = 0;
    }
  }

  static get type() { return QueryType.Buy; }

  async validate() {
    if (!this.coin) {
      return `No coin found.`;
    }
    
    if(!this.amount || !this.price){
      return `Amount and price required.`;
    }
  }

  async execute() {
    this.positions.increase(this.coin.id, this.username, this.price, this.amount);

    return `${this.username} **buys** ${this.amount.toFixed(2)} ${this.coin.symbol} at ${this.price.toFixed(8)} BTC!`;
  }

};