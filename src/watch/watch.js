module.exports = class Watch {

  constructor({ username, coinId } = {}) {
    this.username = username;
    this.coinId = coinId;
  }

  static getInstance(watch) {
    return watch instanceof Watch ? watch : new Watch(watch);
  }

};