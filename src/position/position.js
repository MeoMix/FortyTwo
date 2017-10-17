const moment = require('moment');

module.exports = class Position {

  constructor({ coinId = '', username = '', price = 0, amount = 0, purchasedOn = null } = {}) {
    this.coinId = coinId;
    this.username = username;
    this.price = price;
    this.amount = amount;
    this.purchasedOn = purchasedOn ? moment(purchasedOn) : purchasedOn;
  }

  static getInstance(position) {
    return position instanceof Position ? position : new Position(position);
  }

};