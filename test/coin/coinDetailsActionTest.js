const CoinDetailsAction = require('../../src/coin/coinDetailsAction.js');
const Coin = require('../../src/coin/coin.js');

describe(`CoinDetailsAction`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const coinDetailsAction = new CoinDetailsAction({}, [{}], {});

      expect(coinDetailsAction).not.to.be.null;
    });
  });

  describe(`validate`, () => {
    it(`should return an error if not given a coin to query`, async () => {
      const coinDetailsAction = new CoinDetailsAction({
        values: ['BTC']
      }, [{}], {});

      const result = await coinDetailsAction.validate();

      expect(result).to.equal(`Invalid query. No coins found.`);
    });
  });

  describe(`execute`, () => {
    it(`should return a market message if no coins given`, async () => {
      const coinDetailsAction = new CoinDetailsAction({
        coins: []
      }, [{}], {});

      const message = await coinDetailsAction.execute();

      expect(message.includes(`Total Market Cap`)).to.be.true;
    });

    it(`should return a list of coin summaries if given coins`, async () => {
      const coinDetailsAction = new CoinDetailsAction({
        coins: [new Coin({
          symbol: 'FOO',
          price_btc: .001,
          price_usd: 0,
          percent_change_24h: 0
        })]
      }, [{}], {});

      const message = await coinDetailsAction.execute();

      expect(message.includes(`Total Market Cap`)).to.be.false;
      expect(message.length).to.be.greaterThan(0);
    });
  });

});