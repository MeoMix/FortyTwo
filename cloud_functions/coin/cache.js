const Database = require('./database.js');
const CoinmarketcapApi = require('./coinmarketcapApi.js');
const GdaxApi = require('./gdaxApi.js');

// Use a global cache to store expensive objects to save on costs when responding
// to multiple requests over a period of time.
module.exports = class Cache {

  constructor(){
    // TODO: Don't want to store this in plain text.
    this._config = {
      database: 'fortytwo',
      username: 'root',
      password: '',
      socketPath: '/cloudsql/fortytwo-183202:us-central1:fortytwo-mysql'
    };
    this._database = null;
    this._coinmarketcapApi = null;
    this._gdaxApi = null;
  }

  get database(){
    const { database, username, password, socketPath } = this._config;
    return this._database ? this._database : this._database = new Database(database, username, password, socketPath);
  }
  
  get coinmarketcapApi(){
    return this._coinmarketcapApi ? this._coinmarketcapApi : this._coinmarketcapApi = new CoinmarketcapApi();
  }

  get gdaxApi(){
    return this._gdaxApi ? this._gdaxApi : this._gdaxApi = new GdaxApi();
  }

};
