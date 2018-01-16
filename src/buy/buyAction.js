const { toFloat } = require('../common/utility.js');
const moment = require('moment');
const Position = require('../position/position.js');

// TODO: This assumes Bitcoin, but that doesn't really allow for other pairs to be traded.
// TODO: Prefer not needing the @ symbol and intelligently determining the values based on market prices.
module.exports = class BuyAction {

  constructor({ user = null, coin = null, values = [] } = {}, positionDao) {
    if(!positionDao) throw new Error(`BuyAction expects positionDao`);

    this.user = user;
    this.coin = coin;
    this.values = values;
    this.positionDao = positionDao;

    if(values.length > 1){
      const amountAndPrice = values[1].split('@');
      this.amount = toFloat(amountAndPrice[0]);
      this.price = toFloat(amountAndPrice[1]);
    } else {
      this.amount = 0;
      this.price = 0;
    }
  }

  async validate() {
    if (!this.coin) {
      return `No coin found.`;
    }
    
    if(!this.amount || !this.price){
      return `Amount and price required.`;
    }
  }

  async execute() {
    await this.increasePosition(this.coin.id, this.user.id, this.price, this.amount);

    return `${this.user.username} **buys** ${this.amount.toFixed(2)} ${this.coin.symbol} at ${this.price.toFixed(8)} BTC!`;
  }

  async increasePosition(coinId, userId, price, amount) {
    const position = await this.positionDao.get(coinId, userId);

    if (position) {
      position.price = ((position.price * position.amount) + (price * amount)) / (position.amount + amount);
      position.amount += amount;

      await this.positionDao.update(position);
    } else {
      await this.positionDao.create(new Position({
        coinId,
        userId,
        price,
        amount,
        purchasedOn: moment().format('YYYY-MM-DD HH:mm:ss')
      }));
    }
  }

};