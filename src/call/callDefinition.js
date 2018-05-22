const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('call', {
    id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    guildId: { type: Sequelize.STRING(32), allowNull: false },
    userId: { type: Sequelize.STRING(32), allowNull: false },
    price: { type: Sequelize.DECIMAL, allowNull: false },
    calledOn: { type: Sequelize.DATE, allowNull: false },
    coinId: { type: Sequelize.INTEGER, allowNull: false }
  });
};