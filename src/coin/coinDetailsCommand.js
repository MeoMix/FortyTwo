const Table = require('../common/table.js');
const { moneyFormat, prefixPlus } = require('../common/utility.js');
const { sumBy, orderBy, isFinite } = require('lodash');
const CoinDetailsView = require('./coinDetailsView');

module.exports = class CoinDetailsCommand {

  constructor({ values = [], flags = [] } = {}, coins, coinDao, browser) {
    if(!coinDao) throw new Error(`CoinDetailsCommand expects coinDao`);

    this.values = values;
    this.coins = coins;
    this.flags = flags;
    this.coinDao = coinDao;
    this.browser = browser;

    this.isLight = flags.includes('L') || (coins && coins.length > 1);
    this.isGdax = flags.includes('G');
    this.is24H = flags.includes('24H');
    this.is7D = flags.includes('7D');
    this.isChart = flags.includes('C');
  }

  async validate() {
    if (this.values.length && (!this.coins || !this.coins.length)) {
      return `Invalid command. No coins found.`;
    }
  }

  async execute() {
    if (this.coins.length) {
      const bitcoin = await this.coinDao.get(1);
      const chartUrl = this.isChart ? await this._getChartUrl() : '';
      console.log('chartUrl', chartUrl);

      const coinDetailsView = new CoinDetailsView({
        coins: this.coins,
        isGdax: this.isGdax,
        isLight: this.isLight,
        bitcoin,
        chartUrl
      });

      return coinDetailsView.render();
    } else {
      return await this._getMarketMessage();
    }
  }

  async _getChartUrl() {
    console.log('Getting chart URL');
    if (this.coins.length !== 1) return ``;

    let chartUrl = ``;

    console.log('Creating new page');
    const page = await this.browser.newPage();
    
    try {
      // Make the page large enough for screenshots to be visually pleasing.
      await page.setViewport({ width: 1920, height: 1080 });

      console.log('Navigating to URL');
      // TODO: Make it more than Binance-only by loading exchanges and picking the highest volume.
      const symbol = this.coins[0].symbol;
      const tradedPair = symbol === 'BTC' ? 'USDT' : 'BTC';
      // TODO: Why does this load so slow in production? Also, make it so that the coin details show up and then edit in the chart after?
      await page.goto(`https://www.tradingview.com/chart/?symbol=BINANCE:${symbol}${tradedPair}`, { timeout: 30000 });
      // TODO: Probably want to use page.evaluate here instead of needing to await a lot.
      // Let the canvas element load on the page so that chart can be modified.
      await page.waitForSelector('.chart-markup-table');
    
      // Ensure page is set to 1H by clicking dropdown menu item for 1H
      await page.click('.menu-1fA401bY-');
      await page.click('.dropdown-1zOBoqnG- div:nth-child(8) div');
      // Give a moment to allow the dropdown change to process.
      await page.waitFor(100);
        
      await page.click('.getimage');

      const inputSelector = '.textInput-3WRWEmm7-';
      await page.waitForSelector(inputSelector);
      await page.waitForFunction(`document.querySelector("${inputSelector}").value != ""`);

      chartUrl = await page.evaluate(() => document.querySelector('.textInput-3WRWEmm7-').value);
    } catch (error) {
      console.error(`Failed to get chartUrl. Reason:`, error.message);
    } finally {
      await page.close();
    }

    return chartUrl;
  }

  async _getMarketMessage() {
    const table = new Table(`Best Performing`);
    const timePeriod = this.is7D ? '7D' : this.is24H ? '24H' : '1H';
    table.setHeading([' ', 'Symbol', { value: `% Change (${timePeriod})`, isNumber: true }, { value: 'Volume', isNumber: true }, { value: 'Market Cap', isNumber: true }]);

    // TODO: Instead of relying on `getAll` it would be more efficient to filter coins at DB level.
    // However, not 100% sure this code is going to stick around. So, being lazy for now.
    const coins = await this.coinDao.getAll();
    const activelyTradedCoins = coins.filter(coin => coin.volume && coin.volume > 100000 && coin.market_cap_usd);
    const timePeriodOrder = this.is7D ? 'percent_change_7d' : this.is24H ? 'percent_change_24h' : 'percent_change_1h';
    const validCoins = activelyTradedCoins.filter(coin => isFinite(coin[timePeriodOrder]));

    for (const coin of orderBy(validCoins, timePeriodOrder, ['desc']).slice(0, 15)) {
      table.addRow(table.getRows().length + 1, coin.symbol, `${prefixPlus(coin[timePeriodOrder].toFixed(2))}%`, moneyFormat(coin.volume), moneyFormat(coin.market_cap_usd));
    }

    return `\`Total Market Cap: $${moneyFormat(sumBy(coins, coin => coin.market_cap_usd || 0))}\` \n ${table}`;
  }

};