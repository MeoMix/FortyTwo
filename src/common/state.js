module.exports = class State {

  constructor(coins, calls, watches, positions, calendarItems, coinmarketcapApi, bittrexMonitor) {
    this.coins = coins;
    this.calls = calls;
    this.watches = watches;
    this.positions = positions;
    this.calendarItems = calendarItems;
    this.coinmarketcapApi = coinmarketcapApi;
    this.bittrexMonitor = bittrexMonitor;
    this.refreshInterval = null;
  }

  async load() {
    await this.positions.load();
    await this.calls.load();
    await this.watches.load();
    await this.calendarItems.load();
    await this.bittrexMonitor.initialize();

    await this.refresh();
    clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => this.refresh(), 15000);
  }

  async refresh() {
    const tickers = await this.coinmarketcapApi.getTickers();

    for (const ticker of tickers) {
      this.coins.addOrUpdateCoin(ticker);
    }
  }

};