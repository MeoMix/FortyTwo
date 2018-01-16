const moment = require('moment');

module.exports = class Position {

  constructor({ id = 0, coinId = '', userId = '', price = 0, amount = 0, purchasedOn = null } = {}) {
    this.id = id;
    this.coinId = coinId;
    this.userId = userId;
    this.price = price;
    this.amount = amount;
    this.purchasedOn = purchasedOn ? moment(purchasedOn).format('YYYY-MM-DD HH:mm:ss') : purchasedOn;
  }
  
};