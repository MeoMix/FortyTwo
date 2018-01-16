const Table = require('../common/table.js');

module.exports = class WatchAction {

  constructor({ user = null, coin = null, flags = [] } = {}, coins, bot, watchDao) {
    if(!coins || !coins.length) throw new Error(`WatchAction expects coins`);
    if(!bot) throw new Error(`WatchAction expects bot`);
    if(!watchDao) throw new Error(`WatchAction expects watchDao`);

    this.user = user;
    this.coin = coin;
    this.flags = flags;
    this.coins = coins;
    this.bot = bot;
    this.watchDao = watchDao;

    this.isDelete = flags.includes('D');
  }

  async execute() {
    if(this.isDelete && this.coin){
      this.watchDao.remove(this.user.id, this.coin.id);
      return `${this.user.username} **stopped watching** ${this.coin.symbol}`;
    } else if(this.isDelete && !this.coin){
      throw new Error('Expected delete to be given a coin.');
    }

    return this.coin ? await this._startWatchingCoin() : await this._getWatches();
  }

  async _startWatchingCoin(){
    await this.watchDao.create({
      userId: this.user.id,
      coinId: this.coin.id
    });

    return `${this.user.username} **started watching** ${this.coin.symbol}`;
  }

  async _getWatches(){
    const table = new Table(`Watching`);
    table.setHeading([' ', 'User', 'Symbol']);

    const watches = await this.watchDao.getAll();
    for (const watch of watches) {
      const coin = this.coins.get(watch.coinId);
      const user = this.bot.getUser(watch.userId);
      table.addRow(table.getRows().length + 1, user.username, coin.symbol);
    }

    return `${table}`;
  }

};