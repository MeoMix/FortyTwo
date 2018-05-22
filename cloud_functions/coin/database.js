const Sequelize = require('sequelize');

module.exports = class Database {

  constructor(database, username, password, socketPath){
    console.log(`Creating Sequelize instance for database ${database} as user ${username} // ${password} via socket path: ${socketPath}`);

    this.sequelize = new Sequelize(database, username, password, {
      // Improve security and hide a deprecation warning by limiting operator aliases.
      // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-security
      operatorsAliases: false,
      logging: false,
      dialect: 'mysql',
      dialectOptions: {
        socketPath,
        // Change MySql2 decimals response from string to Number. Not as worried about precision for now
        decimalNumbers: true
      },
      define: {     
        // Prevent sequelize from pluralizing table names
        freezeTableName: true,
        // Prevent sequelize from requiring 'createdAt' timestamp column
        timestamps: false
      }
    });

    this.coinDefinition = this.getCoinDefinition();
    this.gdaxDefinition = this.getGdaxDefinition();
    this.marketDefinition = this.getMarketDefinition();
    this.coinDefinition.hasMany(this.marketDefinition);
  }

  connect(){
    console.log(`Establishing database connection`);

    return this.sequelize.authenticate()
      .then(() => {
        console.log('Connection established');
      })
      .catch(error => {
        console.error(`Failed to connect to database`, error);
        throw error;
      });
  }

  getCoinDefinition(){
    return this.sequelize.define('coin', {
      id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING(32), allowNull: false },
      symbol: { type: Sequelize.STRING(32), allowNull: false },
      websiteSlug: { type: Sequelize.STRING(255), allowNull: false },
      rank: { type: Sequelize.INTEGER, allowNull: false },
      priceUsd: { type: Sequelize.DECIMAL, allowNull: false },
      percentChange1h: { type: Sequelize.DECIMAL, allowNull: false },
      percentChange24h: { type: Sequelize.DECIMAL, allowNull: false },
      percentChange7d: { type: Sequelize.DECIMAL, allowNull: false },
      volume24h: { type: Sequelize.DECIMAL, allowNull: false },
      marketCapUsd: { type: Sequelize.DECIMAL, allowNull: false }
    });
  }

  getGdaxDefinition(){
    return this.sequelize.define('gdax', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      symbol: { type: Sequelize.STRING(32), allowNull: false },
      price: { type: Sequelize.DECIMAL, allowNull: false }
    });
  }

  getMarketDefinition(){
    return this.sequelize.define('market', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(255), allowNull: false },
      rank: { type: Sequelize.INTEGER, allowNull: false },
      url: { type: Sequelize.STRING(255), allowNull: false },
      exchangeName: { type: Sequelize.STRING(255), allowNull: false },
      coinId: { type: Sequelize.INTEGER, allowNull: false }
    });
  }

};