const { filter, reject } = require('lodash');
const logger = require('../common/logger.js');

module.exports = class Exchange {

  constructor(name, api){
    this.name = name;
    this.api = api;
    this.symbols = [];
  }

  async loadSymbols(){
    logger.info(`${this.name} - Loading symbols`);
    const symbols = await this._getSymbols();
    this.symbols.push(...symbols);
    logger.info(`${this.name} - ${this.symbols.length} symbols loaded`);
  }

  async addNewSymbols(){
    logger.info(`${this.name} - Checking for new symbols`);
    const symbols = await this._getSymbols();
    const newSymbols = reject(symbols, symbol => this.symbols.includes(symbol));

    this.symbols.push(...newSymbols);
    logger.info(`${this.name} - Found ${newSymbols.length} new symbol${newSymbols.length === 1 ? '' : 's'}: ${newSymbols.join(',')}`);

    return newSymbols;
  }

  async _getSymbols(){
    const markets = await this.api.getMarkets();
    const bitcoinMarkets = filter(markets, { baseSymbol: 'BTC' });
    return bitcoinMarkets.map(market => market.symbol);
  }

};