
const { toFloat } = require('../common/utility.js');

module.exports = class SellAction {

  constructor({ values = [], user = null, coin = null, flags = [] } = {}, positionDao) {
    if(!positionDao) throw new Error(`SellAction expects positionDao`);

    this.values = values;
    this.user = user;
    this.coin = coin;
    this.flags = flags;
    this.positionDao = positionDao;

    this.amount = values.length > 1 ? toFloat(values[1]) : 0;
    this.isAll = flags.includes('A');
  }

  async validate() {
    if (!this.coin) {
      return `Can't sell. No matching coin found `;
    }

    const position = this.positionDao.get(this.user.id, this.coin.id);
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
      // TODO: broken... don't know amount when removing all.
      result = await this.positionDao.remove(this.user.id, this.coin.id);
    } else {
      result = await this.decreasePosition(this.coin.id, this.user.id, this.amount);
    }

    if (result.amount) {
      return `${this.user.username} **sells** ${result.amount.toFixed(4)} ${this.coin.symbol}!`;
    } else {
      return `Sell failed. Reason: ${result.error}`;
    }
  }

  async decreasePosition(coinId, userId, amount) {
    let position = this.positionDao.get(coinId, userId);

    if (!position) {
      return { error: `No position found.` };
    }

    if (position.amount < amount) {
      return { error: `You own: ${position.amount}, but tried to sell ${amount}` };
    }

    if (position.amount === amount) {
      await this.positionDao.remove(userId, coinId);
    } else {
      position.amount -= amount;
      await this.positionDao.update(position);
    }
    
    return { amount };
  }

};