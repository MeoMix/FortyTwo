const CoinDetailsAction = require('../../src/coin/coinDetailsAction.js');
// const Query = require('../../src/query/query.js');
// const State = require('../../src/common/state.js');
// const Coin = require('../../src/coin/coin.js');

describe(`CoinDetailsAction`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const coinDetailsAction = new CoinDetailsAction();

      expect(coinDetailsAction).not.to.be.null;
    });
  });

  // describe(`execute`, () => {
  //   it(`should output a message`, async () => {
  //     const coinDetailsAction = new CoinDetailsAction(new Query({
  //       coin: new Coin()
  //     }), new State());

  //     const message = await coinDetailsAction.execute();

  //     expect(message.length).to.be.greaterThan(0);
  //   });
  // });

});