const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('coin', {
    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true },
    name: { type: Sequelize.STRING(32), allowNull: false },
    symbol: { type: Sequelize.STRING(32), allowNull: false },
    websiteSlug: { type: Sequelize.STRING(32), allowNull: false },
    rank: { type: Sequelize.INTEGER, allowNull: false },
    priceUsd: { type: Sequelize.DECIMAL, allowNull: false },
    percentChange1h: { type: Sequelize.DECIMAL, allowNull: false },
    percentChange24h: { type: Sequelize.DECIMAL, allowNull: false },
    percentChange7d: { type: Sequelize.DECIMAL, allowNull: false },
    volume24h: { type: Sequelize.DECIMAL, allowNull: false },
    marketCapUsd: { type: Sequelize.DECIMAL, allowNull: false }
  });
};