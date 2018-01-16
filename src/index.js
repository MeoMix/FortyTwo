const Database = require('./common/database.js');
const CoinmarketcapApi = require('./common/coinmarketcapApi.js');
const BittrexApi = require('./common/bittrexApi.js');
const KucoinApi = require('./common/kucoinApi.js');
const BinanceApi = require('./common/binanceApi.js');
const ExchangeMonitor = require('./monitor/exchangeMonitor.js');
const Exchange = require('./monitor/exchange.js');
const CoinStateRefresher = require('./coin/coinStateRefresher.js');
const Query = require('./query/query.js');
const Coins = require('./coin/coins.js');
const GdaxApi = require('./common/gdaxApi.js');
const Bot = require('./common/bot.js');
const ActionFactory = require('./common/actionFactory.js');
const logger = require('./common/logger.js');
const memwatch = require('memwatch-next');
const CoinDetailsView = require('./coin/coinDetailsView.js');
const ChannelDao = require('./channel/channelDao.js');
const { find, filter } = require('lodash');

(async () => {
  
  try {
    memwatch.on('leak', info => console.log('Leaking:', info));

    logger.info('Initializing');
    const database = new Database();
    await database.connect();

    logger.info('Loading coin state');       
    const coinmarketcapApi = new CoinmarketcapApi();
    const coins = new Coins();
    const coinStateRefresher = new CoinStateRefresher(coins, coinmarketcapApi, new GdaxApi());
    await coinStateRefresher.refresh();
    coinStateRefresher.startRefreshing();

    logger.info('Creating bot');
    const bot = new Bot(coins.get(`bitcoin`));

    bot.on('message', async ({ channel, guild, user, words }) => {
      try {
        logger.info('Message received');
        const query = new Query({ channelId: channel ? channel.id : '', guildId: guild ? guild.id : '', user, words, coins });

        // Lazy-load scraped coin data because it's too expensive to load all at once.
        // TODO: Move all of this into a database rather than loading JIT.
        for(const coin of filter(query.coins, coin => !coin.exchanges.length)){
          coin.exchanges = await coinmarketcapApi.getExchanges(coin.id);
        }

        const actionFactory = new ActionFactory(query, coins, database, bot);
        const action = actionFactory.getAction();
        if (!action) return;

        const validationError = action.validate ? await action.validate() : '';
        if (validationError) {
          channel.send(validationError);
          return;
        }
  
        channel.send(await action.execute());
      } catch (error) {
        logger.error(error.message);
        console.error(error);
      }
    });

    logger.info(`Initializing monitoring`);
    const bittrexExchange = new Exchange('Bittrex', new BittrexApi());
    await bittrexExchange.loadSymbols();

    const binanceExchange = new Exchange('Binance', new BinanceApi());
    await binanceExchange.loadSymbols();

    const kucoinExchange = new Exchange('Kucoin', new KucoinApi());
    await kucoinExchange.loadSymbols();

    const exchangeMonitor = new ExchangeMonitor([bittrexExchange, binanceExchange, kucoinExchange]);
    exchangeMonitor.on('newSymbol', async ({ exchangeName, symbol }) => {
      const channelDao = new ChannelDao(database);
      const callChannels = await channelDao.getCallChannels();

      for(const channel of callChannels){
        bot.sendMessage(channel.id, `@everyone **IMPORTANT!!** ${exchangeName} has added ${symbol} to their API.`);

        const coin = find(coins, { symbol });
        if(coin){
          // Lazy-load scraped coin data because it's too expensive to load all at once.
          // TODO: Move all of this into a database rather than loading JIT.
          if(!coin.exchanges.length) {
            coin.exchanges = await coinmarketcapApi.getExchanges(coin.id);
          }
          
          const coinDetailsView = new CoinDetailsView(coin, false, true);
          bot.sendMessage(channel.id, coinDetailsView.render());
        } else {
          logger.warn(`Failed to find coin with symbol ${symbol}`);
        }
      }
    });
    await exchangeMonitor.startMonitoring();

    logger.info('Logging in');
    await bot.login();

    logger.info('Waiting for messages');
  } catch(error){
    logger.error(error);
  }

})();