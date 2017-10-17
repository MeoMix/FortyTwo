const QueryType = require('../query/queryType.js');
const Table = require('../common/table.js');

module.exports = class WatchAction {

  constructor({ username = '', coin = null, flags = [] } = {}, { watches = null, coins = null } = {}) {
    this.username = username;
    this.coin = coin;
    this.flags = flags;
    this.watches = watches;
    this.coins = coins;

    this.isDelete = flags.includes('D');
  }

  static get type() { return QueryType.Watch; }

  async execute() {
    if(this.isDelete && this.coin){
      this.watches.remove(this.username, this.coin.id);
      return `${this.username} **stopped watching** ${this.coin.symbol}`;
    } else if(this.isDelete && !this.coin){
      throw new Error('Expected delete to be given a coin.');
    }

    return this.coin ? await this._startWatchingCoin() : this._getWatches();
  }

  async _startWatchingCoin(){
    await this.watches.add({
      username: this.username,
      coinId: this.coin.id
    });

    return `${this.username} **started watching** ${this.coin.symbol}`;
  }

  _getWatches(){
    const table = new Table(`Watching`);
    table.setHeading([' ', 'User', 'Symbol']);

    for (const watch of this.watches) {
      const coin = this.coins.get(watch.coinId);
      table.addRow(table.getRows().length + 1, watch.username, coin.symbol);
    }

    return `${table}`;
  }

};