const CalcAction = require('../../src/calc/calcAction.js');
const Coins = require('../../src/coin/coins.js');

describe(`CalcAction`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const calcAction = new CalcAction({ words: [] }, { coins: new Coins() });

      expect(calcAction).not.to.be.null;
    });
  });

  describe(`execute`, () => {
    it(`should successfully replace a variable`, async () => {
      const calcAction = new CalcAction({ words: ['BTC_price_usd'] }, { coins: new Coins({ symbol: 'BTC', price_usd: 4000 }) });
      const message = await calcAction.execute();

      expect(message.includes(4000)).to.equal(true);
    });

    it(`should successfully handle parenthesis around a variable`, async () => {
      const calcAction = new CalcAction({ words: ['(BTC_price_usd', '*', '5.0)'] }, { coins: new Coins({ symbol: 'BTC', price_usd: 4000 }) });
      const message = await calcAction.execute();

      expect(message.includes(20000)).to.equal(true);
    });

    it(`should be case insensitive`, async () => {
      const calcAction = new CalcAction({ words: ['(Btc_pRIce_usd', '*', '5.0)'] }, { coins: new Coins({ symbol: 'BTC', price_usd: 4000 }) });
      const message = await calcAction.execute();

      expect(message.includes(4000)).to.equal(true);
    });
  });

});