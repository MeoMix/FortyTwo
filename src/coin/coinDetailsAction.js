const QueryType = require('../query/queryType.js');
const Table = require('../common/table.js');
const { moneyFormat, prefixPlus } = require('../common/utility.js');
const { max, sumBy, isNaN, map, orderBy, filter, take } = require('lodash');

module.exports = class CoinDetailsAction {

  constructor({ values = [], coins = null, flags = [] } = {}, { coins: allCoins = null } = {}) {
    this.values = values;
    this.coins = coins;
    this.flags = flags;
    this.allCoins = allCoins;

    this.isAll = flags.includes('A');
  }

  static get type() { return QueryType.CoinDetails; }

  async validate() {
    if (this.values.length && (!this.coins || !this.coins.length)) {
      return `Invalid query. No coins found.`;
    }
  }

  async execute() {
    if (this.coins.length) {
      return map(this.coins, this._getCoinMessage.bind(this)).join('\n');
    } else {
      return this._getMarketMessage();
    }
  }

  _getMarketMessage() {
    const table = new Table(`Best Performing`);
    table.setHeading([' ', 'Symbol', { value: '% Change (1H)', isNumber: true }, { value: 'Volume', isNumber: true }, { value: 'Market Cap', isNumber: true }]);

    const filteredCoins = filter(this.allCoins, coin => coin.volume && coin.volume > 100000 && coin.market_cap_usd);
    const coins = take(orderBy(filteredCoins, 'percent_change_1h', ['desc']), 15);  
    for (const coin of coins) {
      table.addRow(table.getRows().length + 1, coin.symbol, `${prefixPlus(coin.percent_change_1h.toFixed(2))}%`, moneyFormat(coin.volume), moneyFormat(coin.market_cap_usd));
    }

    return `\`Total Market Cap: $${moneyFormat(sumBy(this.allCoins, coin => coin.market_cap_usd || 0))}\` \n ${table}`;
  }

  _getCoinMessage(coin) {
    const nameSymbolMessage = `**${coin.name} (${coin.symbol})**  •  `;
    const priceBtcMessage = coin.symbol === `BTC` ? `` : `\`${coin.price_btc.toFixed(8)} BTC\`  ⇄  `;
    const priceUsdMessage = `\`$${coin.price_usd.toFixed(3)}\``;
    const oneDayChange = isNaN(coin.percent_change_24h) ? `N/A` : `${prefixPlus(coin.percent_change_24h.toFixed(2))}%`;
    const changeIcon = isNaN(coin.percent_change_24h) ? `` : ` ${this._getChangeIcon(coin.percent_change_24h)}`;
    const changeMessage = `  •  \`${oneDayChange}\`${changeIcon}`;
    const volumeMessage = `  •  \`Volume: ${moneyFormat(coin.volume)}\``;

    const message = `${nameSymbolMessage}${priceBtcMessage}${priceUsdMessage}${changeMessage}${volumeMessage}`;

    if (!this.isAll) {
      return message;
    }

    const oneHourChange = isNaN(coin.percent_change_1h) ? `N/A` : `${prefixPlus(coin.percent_change_1h.toFixed(2))}%`;
    const sevenDayChange = isNaN(coin.percent_change_7d) ? `N/A` : `${prefixPlus(coin.percent_change_7d.toFixed(2))}%`;
    const longest = max([oneHourChange.length, oneDayChange.length, sevenDayChange.length]);

    const oneHourChangeLabel = `1H: ${oneHourChange.padStart(longest)}`.padEnd(20);
    const marketCapLabel = moneyFormat(coin.market_cap_usd).padEnd(20);
    const oneDayChangeLabel = `1D: ${oneDayChange.padStart(longest)}`.padEnd(20);
    const sevenDayChangeLabel = `7D: ${sevenDayChange.padStart(longest)}`.padEnd(20);

    const headers = `\n\n${'Change'.padEnd(20)}${'Market Cap'.padEnd(20)}`;
    const divider = `-`.repeat(30);
    const rowOne = `\n${oneHourChangeLabel}${marketCapLabel}`;
    const rowTwo = `\n${oneDayChangeLabel}`;
    const rowThree = `\n${sevenDayChangeLabel}`;

    const fullChangeMessage = `${headers}\n${divider}${rowOne} ${rowTwo} ${rowThree}`;

    return `${message}\n \`\`\`${fullChangeMessage}\`\`\``;
  }

  _getChangeIcon(changeValue) {
    const emojiis = {
      '100': `:red_car::rocket::full_moon_with_face::moneybag::moneybag:${':100:'.repeat(Math.min(changeValue / 100, 10))}`,
      '50': ':red_car::rocket::full_moon_with_face:',
      '25': ':red_car::rocket:',
      '10': ':red_car:',
      '5': ':smirk:',
      '2.5': ':slight_smile:',
      '1': ':arrow_double_up:',
      '0': ':sleeping:',
      '-1': ':arrow_double_down:',
      '-2.5': ':confounded:',
      '-5': ':dizzy_face:',
      '-7.5': ':ambulance:',
      '-10': ':ambulance::hospital:',
      '-12.5': ':ambulance::hospital::flag_white:',
      '-15': `:ambulance::hospital::flag_white:${':skull_crossbones:'.repeat(Math.abs(Math.min(changeValue / 100, 0)))}`
    };

    if (changeValue >= 100) return emojiis['100'];
    if (changeValue >= 50) return emojiis['50'];
    if (changeValue >= 25) return emojiis['25'];
    if (changeValue >= 10) return emojiis['10'];
    if (changeValue >= 5) return emojiis['5'];
    if (changeValue >= 2.5) return emojiis['2.5'];
    if (changeValue >= 1) return emojiis['1'];
    if (changeValue >= 0) return emojiis['0'];

    if (changeValue <= -15) return emojiis['-15'];
    if (changeValue <= -12.5) return emojiis['-12.5'];
    if (changeValue <= -10) return emojiis['-10'];
    if (changeValue <= -7.5) return emojiis['-7.5'];
    if (changeValue <= -5) return emojiis['-5'];
    if (changeValue <= -2.5) return emojiis['-2.5'];
    if (changeValue <= -1) return emojiis['-1'];
    if (changeValue <= 0) return emojiis['0'];
  }

};