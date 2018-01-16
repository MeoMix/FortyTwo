const Position = require('./position.js');
const Sequelize = require('sequelize');

module.exports = class PositionDao {

  constructor(database){
    this.database = database;
    this.tableName = 'position';

    this.definition = database.sequelize.define(this.tableName, {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.STRING(32), allowNull: false },
      coinId: { type: Sequelize.STRING(32), allowNull: false },
      price: { type: Sequelize.DECIMAL, allowNull: false },
      amount: { type: Sequelize.DECIMAL, allowNull: false },
      purchasedOn: { type: Sequelize.DATE, allowNull: false }
    });
  }
  
  async get(userId, coinId){
    const positionModel = await this.definition.findOne({ where: { userId, coinId } });
    return positionModel ? this._getInstance(positionModel) : null;
  }

  async getByCoinIds(coinIds){
    const positionModels = await this.definition.findAll({
      where: {
        coinId: {
          [Sequelize.Op.contains]: coinIds
        }
      }
    });

    return positionModels.map(positionModel => this._getInstance(positionModel));
  }

  async getByCoinId(coinId){
    const positionModel = await this.definition.findOne({ where: { coinId } });
    return positionModel ? this._getInstance(positionModel) : positionModel;
  }  

  async create({ userId, coinId, price, calledOn } = {}){
    return await this.definition.create({ userId, coinId, price, calledOn });
  }

  async update({ id, price, amount } = {}){
    return await this.definition.update({ price, amount }, { where: { _id: id }});
  }
  
  async remove(userId, coinId){
    return await this.definition.destroy({ where: { userId, coinId } });
  }

  _getInstance({ id, coinId, userId, price, amount, purchasedOn } = {}){
    return new Position({ id, coinId, userId, price, amount, purchasedOn });
  }

};