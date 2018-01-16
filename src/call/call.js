const moment = require('moment');

module.exports = class Call {
  
  constructor({ id = 0, userId = '', coinId = '', price = 0, calledOn = null } = {}){
    this.id = id;
    this.userId = userId;
    this.coinId = coinId;
    this.price = price;
    this.calledOn = calledOn ? moment(calledOn).format('YYYY-MM-DD HH:mm:ss') : calledOn;
  }
  
};