const Table = require('../common/table.js');
const { moneyFormat, prefixPlus } = require('../common/utility.js');
const { sumBy, orderBy, filter, take, isFinite } = require('lodash');
const CoinDetailsView = require('./coinDetailsView');

module.exports = class CoinDetailsAction {

  constructor({ values = [], coins = null, flags = [] } = {}, allCoins) {
    if(!allCoins || !allCoins.length) throw new Error(`CoinDetailsAction expects allCoins`);

    this.values = values;
    this.coins = coins;
    this.flags = flags;
    this.allCoins = allCoins;

    this.isAll = flags.includes('A');
    this.isGdax = flags.includes('G');
    this.is24H = flags.includes('24H');
    this.is7D = flags.includes('7D');
  }

  async validate() {
    if (this.values.length && (!this.coins || !this.coins.length)) {
      return `Invalid query. No coins found.`;
    }
  }

  async execute() {
    if (this.coins.length) {
      const messages = this.coins.map(coin => {
        const coinDetailsView = new CoinDetailsView(coin, this.isGdax, this.isAll);
        return coinDetailsView.render();
      });

      return messages.join('\n\n');
    } else {
      return this._getMarketMessage();
    }
  }

  _getMarketMessage() {
    const table = new Table(`Best Performing`);
    const timePeriod = this.is7D ? '7D' : this.is24H ? '24H' : '1H';
    table.setHeading([' ', 'Symbol', { value: `% Change (${timePeriod})`, isNumber: true }, { value: 'Volume', isNumber: true }, { value: 'Market Cap', isNumber: true }]);

    const activelyTradedCoins = filter(this.allCoins, coin => coin.volume && coin.volume > 100000 && coin.market_cap_usd);
    const timePeriodOrder = this.is7D ? 'percent_change_7d' : this.is24H ? 'percent_change_24h' : 'percent_change_1h';
    const validCoins = filter(activelyTradedCoins, coin => isFinite(coin[timePeriodOrder]));
    const coins = take(orderBy(validCoins, timePeriodOrder, ['desc']), 15);  
    for (const coin of coins) {
      table.addRow(table.getRows().length + 1, coin.symbol, `${prefixPlus(coin[timePeriodOrder].toFixed(2))}%`, moneyFormat(coin.volume), moneyFormat(coin.market_cap_usd));
    }

    return `\`Total Market Cap: $${moneyFormat(sumBy(this.allCoins, coin => coin.market_cap_usd || 0))}\` \n ${table}`;
  }

};