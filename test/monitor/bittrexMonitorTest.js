const BittrexMonitor = require('../../src/monitor/bittrexMonitor.js');

describe(`BittrexMonitor`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const bittrexMonitor = new BittrexMonitor();

      expect(bittrexMonitor).not.to.be.null;
    });
  });

  describe(`initialize`, () => {
    it(`should set 'newestCurrency' properly after initializing`, async () => {
      const bittrexMonitor = new BittrexMonitor({
        getMarkets(){
          return [{
            BaseCurrency: 'ETH',
            MarketCurrency: 'LTC',
            Created: '2014-02-20T20:00:00'
          }, {
            BaseCurrency: 'BTC',
            MarketCurrency: 'WTC',
            Created: '2014-03-20T20:00:00'
          }, {
            BaseCurrency: 'BTC',
            MarketCurrency: 'VEN',
            Created: '2014-04-20T20:00:00'
          }];
        }
      });

      await bittrexMonitor.initialize();

      expect(bittrexMonitor.newestCurrency).to.equal('VEN');
    });
  });

  describe(`checkCurrencies`, () => {
    it(`should emit events when newer currencies detected`, async () => {
      const bittrexMonitor = new BittrexMonitor({
        getMarkets(){
          return [{
            BaseCurrency: 'BTC',
            MarketCurrency: 'OMG',
            Created: '2014-01-20T20:00:00'
          },{
            BaseCurrency: 'ETH',
            MarketCurrency: 'LTC',
            Created: '2014-02-20T20:00:00'
          }, {
            BaseCurrency: 'BTC',
            MarketCurrency: 'WTC',
            Created: '2014-03-20T20:00:00'
          }, {
            BaseCurrency: 'BTC',
            MarketCurrency: 'VEN',
            Created: '2014-04-20T20:00:00'
          }];
        }
      });

      bittrexMonitor.newestCurrency = 'OMG';

      const newCurrencies = [];
      bittrexMonitor.on('newSymbol', currency => {
        newCurrencies.push(currency);
      });
      await bittrexMonitor.checkCurrencies();

      expect(newCurrencies[0]).to.equal('VEN');
      expect(newCurrencies[1]).to.equal('WTC');
    });
  });

});