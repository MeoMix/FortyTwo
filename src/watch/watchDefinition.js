const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('watch', {
    id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    userId: { type: Sequelize.STRING(32), allowNull: false },
    coinId: { type: Sequelize.INTEGER, allowNull: false }
  });
};