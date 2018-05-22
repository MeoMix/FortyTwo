const AutomaticMarketUpdates = require('../../src/exchange/automaticMarketUpdates.js');
const mixin = require('es6-class-mixin');

const MockExchange = class MockExchange extends mixin(AutomaticMarketUpdates) {
  constructor({ api, markets } = {}){
    super(...arguments);

    this.name = 'Mock';
    this.api = api;
    this.markets = markets;
  }
};

describe(`AutomaticMarketUpdates`, () => {
  
  describe(`constructor`, () => {
    it(`should be enabled by default`, () => {
      const exchange = new MockExchange({ api: {}, markets: [] });
      expect(exchange.updateIntervalId).not.to.be.null;
    });

    it(`should support being disabled initially`, () => {
      const exchange = new MockExchange({ api: {}, markets: [], enableAutomaticUpdates: false });
      expect(exchange.updateIntervalId).to.be.null;
    });
  });

  describe(`enableAutomaticUpdates`, () => {
    it(`should successfully set the refresh timer if disabled`, () => {
      const exchange = new MockExchange({ api: {}, markets: [], enableAutomaticUpdates: false });

      exchange.enableAutomaticUpdates();

      expect(exchange.updateIntervalId).not.to.be.null;
    });

    it(`should not change the refresh timer if it is already enabled`, () => {
      const exchange = new MockExchange({ api: {}, markets: [] });

      const original = exchange.updateIntervalId;
      exchange.enableAutomaticUpdates();

      expect(exchange.updateIntervalId).to.equal(original);
    });
  });

  describe(`disableAutomaticUpdates`, () => {
    it(`should successfully clear the refresh timer if enabled`, () => {
      const exchange = new MockExchange({ api: {}, markets: [] });

      exchange.disableAutomaticUpdates();

      expect(exchange.updateIntervalId).to.be.null;
    });

    it(`should not error if the refresh timer is already disabled`, () => {
      const exchange = new MockExchange({ api: {}, markets: [], enableAutomaticUpdates: false });

      exchange.disableAutomaticUpdates();

      expect(exchange.updateIntervalId).to.be.null;
    });
  });

  describe(`addNewMarkets`, () => {
    it(`should do nothing if no new markets are to be added`, async () => {
      const exchange = new MockExchange({ api: {
        getMarkets(){
          return [{
            symbol: 'MLN',
            baseSymbol: 'BTC'
          }];
        }
      }, markets: [{
        symbol: 'MLN',
        baseSymbol: 'BTC'
      }], enableAutomaticUpdates: false });

      await exchange.addNewMarkets();

      expect(exchange.markets.length).to.equal(1);
    });

    it(`should not error if the api returns no results`, async () => {
      const exchange = new MockExchange({ api: {
        getMarkets(){
          return [];
        }
      }, markets: [{
        symbol: 'MLN',
        baseSymbol: 'BTC'
      }], enableAutomaticUpdates: false });

      await exchange.addNewMarkets();

      expect(exchange.markets.length).to.equal(1);
    });

    it(`should add new markets if found`, async () => {
      const exchange = new MockExchange({ api: {
        getMarkets(){
          return [{
            symbol: 'VEN',
            baseSymbol: 'BTC'
          }];
        }
      }, markets: [{
        symbol: 'MLN',
        baseSymbol: 'BTC'
      }], enableAutomaticUpdates: false });

      await exchange.addNewMarkets();

      expect(exchange.markets.length).to.equal(2);
    });
  });

});