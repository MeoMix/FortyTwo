const Sequelize = require('sequelize');
const CallDefinition = require('../call/callDefinition.js');
const CoinDefinition = require('../coin/coinDefinition.js');
const CalendarItemDefinition = require('../calendar/calendarItemDefinition.js');
const ChannelDefinition = require('../channel/channelDefinition.js');
const WatchDefinition = require('../watch/watchDefinition.js');
const MarketDefinition = require('../market/marketDefinition.js');

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

    this.callDefinition = CallDefinition(this.sequelize);
    this.coinDefinition = CoinDefinition(this.sequelize);
    this.calendarItemDefinition = CalendarItemDefinition(this.sequelize);
    this.channelDefinition = ChannelDefinition(this.sequelize);
    this.watchDefinition = WatchDefinition(this.sequelize);
    this.marketDefinition = MarketDefinition(this.sequelize);

    // TODO: Not sure `belongsTo` is correct usage here.
    this.callDefinition.belongsTo(this.coinDefinition);
    this.watchDefinition.belongsTo(this.coinDefinition);
    this.coinDefinition.hasMany(this.marketDefinition);
  }

  async connect(){
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`Connecting to database`);
        await this.sequelize.authenticate();
        console.log('Sequelize authenticated');
        resolve();
      } catch (error){
        console.error(`Failed to connect to database`);
        reject(error);
      }
    });
  }

};