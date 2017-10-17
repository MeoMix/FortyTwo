const Position = require('./position.js');
const { read, write } = require('../common/utility.js');
const { map, remove, filter, find } = require('lodash');
const moment = require('moment');
const mkdirp = require('async-mkdirp');

module.exports = class Positions extends Array {

  constructor(...positions) {
    super(...map(positions, Position.getInstance));

    this.directoryPath = `/discord/bot`;
    this.filePath = `${this.directoryPath}/positions.json`;
  }

  async increase(coinId, username, price, amount) {
    let position = this.get(coinId, username);

    if (!position) {
      position = await this.add({
        coinId,
        username,
        price,
        purchasedOn: moment()
      });
    }

    position.price = ((position.price * position.amount) + (price * amount)) / (position.amount + amount);
    position.amount += amount;
    await write(this.filePath, this);
  }

  async decrease(coinId, username, amount) {
    let position = this.get(coinId, username);

    if (!position) {
      return { error: `No position found.` };
    }

    if (position.amount < amount) {
      return { error: `You own: ${position.amount}, but tried to sell ${amount}` };
    }

    if (position.amount === amount) {
      remove(this, { coinId, username });
    } else {
      position.amount -= amount;
    }

    await write(this.filePath, this);

    return { amount };
  }

  async remove(coinId, username) {
    const position = this.get(coinId, username);

    if (!position) {
      return { error: `No position found.` };
    }

    remove(this, { coinId, username });
    await write(this.filePath, this);
    return { amount: position.amount };
  }

  get(coinId, username) {
    return find(this, { coinId, username });
  }

  getByCoinId(coinId) {
    return filter(this, { coinId });
  }

  getByUsername(username) {
    return filter(this, { username });
  }

  async load() {
    await mkdirp(this.directoryPath);

    this.length = 0;
    this.push(...map(await read(this.filePath), Position.getInstance));
  }

  async add(position) {
    this.push(Position.getInstance(position));
    await write(this.filePath, this);

    return this[this.length - 1];
  }

};