const Sequelize = require('sequelize');
const logger = require('../common/logger.js');

module.exports = class Database {

  constructor(){
    const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
      // Improve security and hide a deprecation warning by limiting operator aliases.
      // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-security
      operatorsAliases: false,
      dialect: 'mysql',
      dialectOptions: {
        socketPath: process.env.DB_SOCKET_PATH,
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

    this.sequelize = sequelize;
  }

  async connect(){
    return new Promise(async (resolve, reject) => {
      try {
        logger.info(`Connecting to database ${process.env.DB_DATABASE} as ${process.env.DB_USERNAME}`);

        await this.sequelize.authenticate();

        logger.debug('Sequelize authenticated');
        resolve();
      } catch (error){
        logger.error(`Failed to connect to database`);
        reject(error);
      }
    });
  }

};