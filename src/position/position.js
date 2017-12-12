const moment = require('moment');

module.exports = class Position {

  constructor({ id = 0, coinId = '', username = '', price = 0, amount = 0, purchasedOn = null } = {}) {
    this.id = id;
    this.coinId = coinId;
    this.username = username;
    this.price = price;
    this.amount = amount;
    this.purchasedOn = purchasedOn ? moment(purchasedOn).format('YYYY-MM-DD HH:mm:ss') : purchasedOn;
  }

  static getInstance(position) {
    return position instanceof Position ? position : new Position(position);
  }

};