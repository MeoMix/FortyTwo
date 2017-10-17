module.exports = class Call {
  
  constructor({ username, coinId, price, calledOn } = {}){
    this.username = username;
    this.coinId = coinId;
    this.price = price;
    this.calledOn = calledOn;
  }

  static getInstance(call){
    return call instanceof Call ? call : new Call(call);
  }

};