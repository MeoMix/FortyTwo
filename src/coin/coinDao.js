const Coin = require('./coin.js');
const Market = require('../market/market.js');
const Sequelize = require('sequelize');

module.exports = class CoinDao {

  constructor({ coinDefinition, marketDefinition } = {}){
    if(!coinDefinition) throw new Error(`CoinDao expects coinDefinition`);
    if(!marketDefinition) throw new Error(`CoinDao expects marketDefinition`);

    this.coinDefinition = coinDefinition;
    this.marketDefinition = marketDefinition;
  }

  async bulkCreateOrUpdate(coins){
    return await this.coinDefinition.bulkCreate(coins.map(coin => this._getDao(coin)), {
      updateOnDuplicate: true
    });
  }
  
  async get(id){
    const coinModel = await this.coinDefinition.findOne({
      where: { id },
      include: [{
        model: this.marketDefinition,
        as: 'markets'
      }]
    });
    return coinModel ? this._getDomain(coinModel) : null;
  }

  async getAll(){
    const coinModels = await this.coinDefinition.findAll({
      include: [{
        model: this.marketDefinition,
        as: 'markets'
      }]
    });
    return coinModels.map(coinModel => this._getDomain(coinModel));
  }

  // TODO: Improve performance by filtering at database layer rather than calling `getAll`
  async getByMessage(message) {
    const coinModels = await this.coinDefinition.findAll({
      where: {
        [Sequelize.Op.or]: [{
          symbol: message.values
        }, {
          // TODO: Make this case-insensitive.
          name: message.values
        }]
      },
      include: [{
        model: this.marketDefinition,
        as: 'markets'
      }]
    });

    return coinModels.map(coinModel => this._getDomain(coinModel));
  }

  _getDomain(coinDao){
    return new Coin({
      id: coinDao.id,
      name: coinDao.name,
      symbol: coinDao.symbol,
      websiteSlug: coinDao.websiteSlug,
      rank: coinDao.rank,
      price_usd: coinDao.priceUsd,
      percent_change_1h: coinDao.percentChange1h,
      percent_change_24h: coinDao.percentChange24h,
      percent_change_7d: coinDao.percentChange7d,
      volume: coinDao.volume24h,
      market_cap_usd: coinDao.marketCapUsd,
      markets: coinDao.markets.map(market => this._getMarketDomain(market))
    });
  }

  _getMarketDomain(marketDao){
    return new Market({
      id: marketDao.id,
      name: marketDao.name,
      rank: marketDao.rank,
      exchangeName: marketDao.exchangeName,
      url: marketDao.url,
      // TODO: coin circular reference?
    });
  }

  _getDao(coin){
    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      websiteSlug: coin.websiteSlug,
      rank: coin.rank,
      priceUsd: coin.price_usd || 0,
      percentChange1h: coin.percent_change_1h || 0,
      percentChange24h: coin.percent_change_24h || 0,
      percentChange7d: coin.percent_change_7d || 0,
      volume24h: coin.volume || 0,
      marketCapUsd: coin.market_cap_usd || 0
    };
  }

};