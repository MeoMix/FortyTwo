const CalcCommand = require('../../src/calc/calcCommand.js');
const Coin = require('../../src/coin/coin.js');

describe(`CalcCommand`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const calcCommand = new CalcCommand({ words: [] }, {});

      expect(calcCommand).not.to.be.null;
    });
  });

  describe(`execute`, () => {
    it(`should successfully replace a variable`, async () => {
      const calcCommand = new CalcCommand({ words: ['BTC_price_usd'] }, {
        getAll(){ return [new Coin({ symbol: 'BTC', price_usd: 4000 })]; }
      });
      const message = await calcCommand.execute();

      expect(message.includes('4,000')).to.equal(true);
    });

    it(`should successfully handle parenthesis around a variable`, async () => {
      const calcCommand = new CalcCommand({ words: ['(BTC_price_usd', '*', '5.0)'] }, {
        getAll(){ return [new Coin({ symbol: 'BTC', price_usd: 4000 })]; }
      });
      const message = await calcCommand.execute();

      expect(message.includes('20,000')).to.equal(true);
    });

    it(`should be case insensitive`, async () => {
      const calcCommand = new CalcCommand({ words: ['(Btc_pRIce_usd', '*', '5.0)'] }, {
        getAll(){ return [new Coin({ symbol: 'BTC', price_usd: 4000 })]; }
      });
      const message = await calcCommand.execute();

      expect(message.includes('4000')).to.equal(true);
    });

    it(`should not truncate small results to 0`, async () => {
      const calcCommand = new CalcCommand({ words: ['(BTC_price_usd', '*', '.0001)'] }, {
        getAll(){ return [new Coin({ symbol: 'BTC', price_usd: 4 })]; }
      });
      const message = await calcCommand.execute();

      expect(message.includes('.0004')).to.equal(true);
    });
  });

});