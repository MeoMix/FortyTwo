const moment = require('moment');

module.exports = class Call {
  
  constructor({ id = 0, userId = '', price = 0, calledOn = null, coin = null } = {}){
    this.id = id;
    this.userId = userId;
    this.price = price;
    this.calledOn = calledOn ? moment(calledOn).format('YYYY-MM-DD HH:mm:ss') : calledOn;
    this.coin = coin;
  }
  
};