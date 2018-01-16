const Sequelize = require('sequelize');

module.exports = class WatchDao {

  constructor(database){
    this.database = database;
    this.tableName = 'watch';

    this.definition = database.sequelize.define(this.tableName, {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.STRING(32), allowNull: false },
      coinId: { type: Sequelize.STRING(32), allowNull: false }
    });
  }
  
  async remove(userId, coinId){
    return await this.definition.destroy({ where: { userId, coinId } });
  }
};