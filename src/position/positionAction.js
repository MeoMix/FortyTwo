const { getPercentChange } = require('../common/utility.js');
const Table = require('../common/table.js');
const { sumBy, groupBy, find } = require('lodash');

module.exports = class PositionAction {

  constructor({ user = null, coin = null, flags = [] } = {}, coins, positionDao) {
    if(!coins || !coins.length) throw new Error(`PositionAction expects coins`);
    if(!positionDao) throw new Error(`PositionAction expects positionDao`);

    this.user = user;
    this.coin = coin;
    this.flags = flags;
    this.coins = coins;
    this.positionDao = positionDao;

    this.isAll = flags.includes('A');
  }

  async execute() {
    if (this.coin) {
      return await this._getCoinPositions(this.coin);
    } else {
      return this.isAll ? await this._getAllPositions() : await this._getUserPositions();
    }
  }

  async _getAllPositions() {
    const table = new Table(`Positions`);
    table.setHeading([' ', 'Symbol', 'Traders', { value: 'Amount (Sum)', isNumber: true }]);

    const positions = await this.positionDao.getByCoinIds(this.coins.map(c => c.id));
    const positionGroups = groupBy(positions, 'coinId');

    for (const [coinId, positions] of positionGroups) {
      const coin = find(this.coins, { id: coinId });
      table.addRow(table.getRows().length + 1, coin.symbol, positions.length, sumBy(positions, 'amount').toFixed(2));
    }

    return `${table}`;
  }

  async _getUserPositions() {
    const table = new Table(`Positions • ${this.user.username}`);
    table.setHeading([' ', 'Symbol', { value: 'Price', isNumber: true }, { value: 'Amount', isNumber: true }, { value: '% Change', isNumber: true }, 'Purchased On']);

    const positions = await this.positionDao.getByUserId(this.user.id);
    for (const position of positions) {
      const coin = this.coins.get(position.coinId);
      const percentChange = getPercentChange(coin.price_btc, position.price);
      table.addRow(table.getRows().length + 1, coin.symbol, position.price.toFixed(8), position.amount.toFixed(2), percentChange, position.purchasedOn.format('MM/DD HH:mm'));
    }

    return `${table}`;
  }

  async _getCoinPositions(coin) {
    const table = new Table(`Positions • ${coin.name} (${coin.symbol}) • ${coin.price_btc.toFixed(8)}`);
    table.setHeading([' ', 'User', { value: 'Price', isNumber: true }, { value: 'Amount', isNumber: true }, { value: '% Change', isNumber: true }, 'Purchased On']);

    const positions = await this.positionDao.getByCoinId(coin.id);
    for (const position of positions) {
      const percentChange = getPercentChange(coin.price_btc, position.price);
      table.addRow(table.getRows().length + 1, position.username, position.price.toFixed(8), position.amount.toFixed(2), percentChange, position.purchasedOn.format('MM/DD HH:mm'));
    }

    return `${table}`;
  }

};