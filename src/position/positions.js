const Position = require('./position.js');
const { getAllEntities, deleteEntity, createEntity, updateEntity } = require('../common/database.js');
const { map, remove, filter, find } = require('lodash');
const moment = require('moment');

module.exports = class Positions extends Array {

  constructor(...positions) {
    super(...map(positions, Position.getInstance));
  }

  async increase(coinId, username, price, amount) {
    let position = this.get(coinId, username);

    if (!position) {
      // TODO: Sloppy. No need to create and then update after.
      // TODO: add vs create
      position = await this.add({
        coinId,
        username,
        price,
        purchasedOn: moment().format('YYYY-MM-DD HH:mm:ss')
      });
    }

    position.price = ((position.price * position.amount) + (price * amount)) / (position.amount + amount);
    position.amount += amount;

    await updateEntity(`position`, position);
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
    
    await updateEntity(`position`, position);

    return { amount };
  }

  async remove(coinId, username) {
    const position = this.get(coinId, username);

    if (!position) {
      return { error: `No position found.` };
    }

    remove(this, { coinId, username });
    await deleteEntity(`position`, position.id);

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
    this.length = 0;
    this.push(...map(await getAllEntities('position'), Position.getInstance));
  }

  async add(position) {
    const positionInstance = Position.getInstance(position);
    positionInstance.id = await createEntity(`position`, positionInstance);
    this.push(positionInstance);

    return positionInstance;
  }

};