const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('market', {
    id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING(255), allowNull: false },
    rank: { type: Sequelize.INTEGER, allowNull: false },
    url: { type: Sequelize.STRING(255), allowNull: false },
    exchangeName: { type: Sequelize.STRING(255), allowNull: false },
    coinId: { type: Sequelize.STRING(32), allowNull: false }
  });
};