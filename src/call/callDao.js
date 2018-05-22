const Call = require('./call.js');
const Coin = require('../coin/coin.js');
const Sequelize = require('sequelize');

module.exports = class CallDao {

  constructor({ callDefinition, coinDefinition } = {}){
    if(!callDefinition) throw new Error(`CallDao expects callDefinition`);
    if(!coinDefinition) throw new Error(`CallDao expects coinDefinition`);

    this.callDefinition = callDefinition;
    this.coinDefinition = coinDefinition;
  }

  async create({ id, userId, guildId, coinId, price, calledOn } = {}){
    return await this.callDefinition.create({ id, userId, coinId, guildId, price, calledOn }, {
      include: [this.coinDefinition]
    });
  }

  async removeByUserId(guildId, userId){
    return await this.callDefinition.destroy({ where: { guildId, userId } });
  }

  async remove(guildId, userId, coinId){
    return await this.callDefinition.destroy({ where: { guildId, userId, coinId } });
  }
  
  async get(guildId, userId, coinId){
    const callModel = await this.callDefinition.findOne({
      where: { guildId, userId },
      include: [{
        model: this.coinDefinition,
        as: 'coin',
        where: { id: coinId }
      }]
    });

    return callModel ? this._getInstance(callModel) : null;
  }

  async getByUserId(guildId, userId, limit){
    const callModels = await this.callDefinition.findAll({
      where: { guildId, userId },
      limit,
      order: [['calledOn', 'DESC']],
      include: [{
        model: this.coinDefinition,
        as: 'coin'
      }]
    });
    return callModels.map(callModel => this._getInstance(callModel));
  }

  async getAll(guildId, limit){
    const callModels = await this.callDefinition.findAll({
      where: { guildId },
      limit,
      order: [['calledOn', 'DESC']],
      include: [{
        model: this.coinDefinition,
        as: 'coin'
      }]
    });
    return callModels.map(callModel => this._getInstance(callModel));
  }

  async getWithinDateRange(guildId, startDate, endDate, limit){
    const callModels = await this.callDefinition.findAll({
      where: {
        guildId,          
        calledOn: {
          [Sequelize.Op.between]: [startDate.toDate(), endDate.toDate()]
        }
      },
      limit,
      order: [['calledOn', 'DESC']],
      include: [{
        model: this.coinDefinition,
        as: 'coin'
      }]
    });

    return callModels.map(callModel => this._getInstance(callModel));
  }

  _getInstance({ id, userId, price, calledOn, coin } = {}){
    return new Call({ id, userId, price, calledOn, coin: this._getCoinDomain(coin) });
  }

  _getCoinDomain(coinDao){
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
      market_cap_usd: coinDao.marketCapUsd
    });
  }

};