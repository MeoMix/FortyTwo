const moment = require('moment');

module.exports = class Call {
  
  constructor({ id = 0, username = '', coinId = '', price = 0, calledOn = null } = {}){
    this.id = id;
    this.username = username;
    this.coinId = coinId;
    this.price = price;
    this.calledOn = calledOn ? moment(calledOn).format('YYYY-MM-DD HH:mm:ss') : calledOn;
  }

  static getInstance(call){
    return call instanceof Call ? call : new Call(call);
  }

};