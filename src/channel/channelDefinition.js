const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('channel', {
    id: { type: Sequelize.STRING(32), allowNull: false, primaryKey: true },
    isCallChannel: { type: Sequelize.BOOLEAN, allowNull: false }
  });
};