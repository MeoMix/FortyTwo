const CoinDetailsCommand = require('../../src/coin/coinDetailsCommand.js');
const Coin = require('../../src/coin/coin.js');

describe(`CoinDetailsCommand`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const coinDetailsCommand = new CoinDetailsCommand({}, [{}], {});

      expect(coinDetailsCommand).not.to.be.null;
    });
  });

  describe(`validate`, () => {
    it(`should return an error if not given a coin to command`, async () => {
      const coinDetailsCommand = new CoinDetailsCommand({
        values: ['BTC']
      }, [], {});

      const result = await coinDetailsCommand.validate();

      expect(result).to.equal(`Invalid command. No coins found.`);
    });

    it(`should not return an error if given a coin to command`, async () => {
      const coinDetailsCommand = new CoinDetailsCommand({
        values: ['BTC']
      }, [{}], {});

      const result = await coinDetailsCommand.validate();

      expect(result).to.be.undefined;
    });
  });

  describe(`execute`, () => {
    it(`should return a market message if no coins given`, async () => {
      const coinDetailsCommand = new CoinDetailsCommand({}, [], {
        getAll(){ return []; }
      });
      const message = await coinDetailsCommand.execute();

      expect(message.includes(`Total Market Cap`)).to.be.true;
    });

    it(`should return a list of light coin summaries if given multiple coins`, async () => {
      const coinA = new Coin({
        symbol: 'FOO',
        price_usd: 100,
        percent_change_24h: 0
      });

      const coinB = new Coin({
        symbol: 'BAR',
        price_usd: 1000,
        percent_change_24h: 0
      });

      const coinDetailsCommand = new CoinDetailsCommand({}, [coinA, coinB], {
        getAll(){ return [coinA, coinB]; }
      });

      const message = await coinDetailsCommand.execute();

      expect(message.embed.fields.length).to.equal(coinDetailsCommand.coins.length);
    });
  });

});