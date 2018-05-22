const CoinDetailsView = require('../coin/coinDetailsView.js');

module.exports = class ExchangeUpdateMessenger {

  constructor(bot, channelDao, coinDao){
    this.bot = bot;
    this.channelDao = channelDao;
    this.coinDao = coinDao;
  }

  startMonitoring(exchanges){
    for(const exchange of exchanges){
      exchange.on('add:markets', async markets => await this._notifyChannels(exchange.name, markets.map(({ symbol }) => symbol)));
    }
  }

  async _notifyChannels(exchangeName, symbols){
    const channels = await this.channelDao.getCallChannels();
    await Promise.all(channels.map(({ id }) => this._notifyChannel(id, exchangeName, symbols)));
  }

  async _notifyChannel(channelId, exchangeName, symbols){
    // Fetch coins earlier than necessary so that bot messages all come at the same time.
    // TODO: Implement getBySymbols
    const coins = (await this.coinDao.getAll()).filter(coin => symbols.includes(coin.symbol));
    const bitcoin = await this.coinDao.get(1);
    
    this.bot.respond(channelId, `@everyone **${exchangeName}** has added **${symbols.length}** coin${symbols.length === 1 ? '' : 's'}: **${symbols.join(', ')}**.`);
    this.bot.respond(channelId, (new CoinDetailsView({ coins, bitcoin })).render());
  }

};