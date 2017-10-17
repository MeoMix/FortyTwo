const { getPercentChange } = require('../common/utility.js');
const QueryType = require('../query/queryType.js');
const Table = require('../common/table.js');
const { sumBy } = require('lodash');

module.exports = class PositionsAction {

  constructor({ username = '', coin = null, flags = [] } = {}, { coins = null, positions = null } = {}) {
    this.username = username;
    this.coin = coin;
    this.flags = flags;
    this.coins = coins;
    this.positions = positions;

    this.isAll = flags.includes('A');
  }

  static get type() { return QueryType.Positions; }

  async execute() {
    if (this.coin) {
      return this._getCoinPositions(this.coin);
    } else {
      return this.isAll ? this._getAllPositions() : this._getUserPositions();
    }
  }

  _getAllPositions() {
    const table = new Table(`Positions`);
    table.setHeading([' ', 'Symbol', 'Traders', { value: 'Amount (Sum)', isNumber: true }]);

    for (const coin of this.coins) {
      const positions = this.positions.getByCoinId(coin.id);

      if (positions.length) {
        table.addRow(table.getRows().length + 1, coin.symbol, positions.length, sumBy(positions, 'amount').toFixed(2));
      }
    }

    return `${table}`;
  }

  _getUserPositions() {
    const table = new Table(`Positions • ${this.username}`);
    table.setHeading([' ', 'Symbol', { value: 'Price', isNumber: true }, { value: 'Amount', isNumber: true }, { value: '% Change', isNumber: true }, 'Purchased On']);

    const positions = this.positions.getByUsername(this.username);
    for (const position of positions) {
      const coin = this.coins.get(position.coinId);
      const percentChange = getPercentChange(coin.price_btc, position.price);
      table.addRow(table.getRows().length + 1, coin.symbol, position.price.toFixed(8), position.amount.toFixed(2), percentChange, position.purchasedOn.format('MM/DD HH:mm'));
    }

    return `${table}`;
  }

  _getCoinPositions(coin) {
    const table = new Table(`Positions • ${coin.name} (${coin.symbol}) • ${coin.price_btc.toFixed(8)}`);
    table.setHeading([' ', 'User', { value: 'Price', isNumber: true }, { value: 'Amount', isNumber: true }, { value: '% Change', isNumber: true }, 'Purchased On']);

    const positions = this.positions.getByCoinId(coin.id);
    for (const position of positions) {
      const percentChange = getPercentChange(coin.price_btc, position.price);
      table.addRow(table.getRows().length + 1, position.username, position.price.toFixed(8), position.amount.toFixed(2), percentChange, position.purchasedOn.format('MM/DD HH:mm'));
    }

    return `${table}`;
  }

};