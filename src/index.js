const CoinmarketcapApi = require('./common/coinmarketcapApi.js');
const State = require('./common/state.js');
const Query = require('./query/query.js');
const BuyAction = require('./buy/buyAction.js');
const SellAction = require('./sell/sellAction.js');
const Coins = require('./coin/coins.js');
const CoinDetailsAction = require('./coin/coinDetailsAction.js');
const Positions = require('./position/positions');
const PositionsAction = require('./position/positionsAction.js');
const Calls = require('./call/calls.js');
const CallAction = require('./call/callAction.js');
const Watches = require('./watch/watches.js');
const WatchAction = require('./watch/watchAction.js');
const CalcAction = require('./calc/calcAction.js');
const HelpAction = require('./help/helpAction.js');
const TimeAction = require('./time/timeAction.js');
const CalendarAction = require('./calendar/calendarAction.js');
const CalendarItems = require('./calendar/calendarItems.js');
const Bot = require('./common/bot.js');
const { find, map } = require('lodash');

const state = new State(new Coins(), new Calls(), new Watches(), new Positions(), new CalendarItems(), new CoinmarketcapApi());
const pendingQueries = {};
// const channel = new Channel();

(async () => {
  await state.load();
  const bot = new Bot(state.coins.get(`bitcoin`));

  bot.on('message', async ({ channel, username, userId, words }) => {
    try {
      let query = pendingQueries[userId];

      if(query){
        const result = query.setChosenCoin(words[0]);
        if(result.isCancelled || result.isSuccessful){
          delete pendingQueries[userId];
        }

        if(result.isCancelled){
          channel.send('Query cancelled.');
          return;
        }

        if(!result.isSuccessful){
          channel.send(`Sorry. I didn't understand your choice. Please select a valid option or say 'cancel'`);
          return;
        }
      } else {
        query = new Query({ username, words, coins: state.coins });
        
        if(query.needsCoinConfirmation){
          const confirm = query.coinConfirmations[0];
          channel.send(`<@${userId}> - The symbol ${confirm.coins[0].symbol} matches ${confirm.coins.length} coins. Please clarify by responding with a number, or say 'cancel':\n${map(confirm.coins, (coin, index) => `${index + 1}. ${coin.name}\n`).join('')}`);
          pendingQueries[userId] = query;
          return;
        }
      }

      const actionTypes = [BuyAction, SellAction, CoinDetailsAction, PositionsAction, CallAction, WatchAction, CalcAction, HelpAction, TimeAction, CalendarAction];
      const Action = find(actionTypes, { type: query.type });
      if (!Action) return;

      const action = new Action(query, state);

      const validationError = action.validate ? await action.validate() : '';
      if (validationError) {
        channel.send(validationError);
        return;
      }

      channel.send(await action.execute());
    } catch (error) {
      console.error(error);
    }

  });

  await bot.login();
})();