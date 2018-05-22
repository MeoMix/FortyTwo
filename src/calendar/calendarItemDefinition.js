const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('calendaritem', {
    id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    userId: { type: Sequelize.STRING(32), allowNull: false },
    notes: { type: Sequelize.STRING(1000), allowNull: false },
    date: { type: Sequelize.DATE, allowNull: false }
  });
};