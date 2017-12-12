module.exports = class Watch {

  constructor({ id = 0, username = '', coinId = '' } = {}) {
    this.id = id;
    this.username = username;
    this.coinId = coinId;
  }

  static getInstance(watch) {
    return watch instanceof Watch ? watch : new Watch(watch);
  }

};