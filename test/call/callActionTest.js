const CallAction = require('../../src/call/callAction.js');
const Call = require('../../src/call/call.js');
const Coin = require('../../src/coin/coin.js');
const User = require('../../src/common/user.js');
const sinon = require('sinon');

describe(`CallAction`, () => {

  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const callDaoMock = {};
      const callAction = new CallAction({}, [{}], {}, callDaoMock);

      expect(callAction).not.to.be.null;
    });
  });

  describe(`validate`, () => {
    it(`should error when deleting without a coin or the 'delete all' flag`, async () => {
      const callDaoMock = {
        get: sinon.stub()
      };
  
      const callAction = new CallAction({
        values: ['XLM'],
        flags: ['D'],
        user: new User()
      }, [{}], {}, callDaoMock);
  
      const result = await callAction.validate();
  
      expect(result).to.equal(`No coin found.`);
    });

    it(`should error when calling with a price of zero`, async () => {
      const callDaoMock = {
        get: sinon.stub()
      };
  
      const callAction = new CallAction({
        values: ['XLM', '0'],
        coin: new Coin({
          symbol: 'FOO',
          price_btc: .001
        }),
        user: new User()
      }, [{}], {}, callDaoMock);
  
      const result = await callAction.validate();
  
      expect(result).to.equal(`Price must be greater than zero.`);
    });

    it(`should error when calling with a negative price`, async () => {
      const callDaoMock = {
        get: sinon.stub()
      };
  
      const callAction = new CallAction({
        values: ['XLM', '-1.0'],
        coin: new Coin({
          symbol: 'FOO',
          price_btc: .001
        }),
        user: new User()
      }, [{}], {}, callDaoMock);
  
      const result = await callAction.validate();
  
      expect(result).to.equal(`Price must be greater than zero.`);
    });

    it(`should return an error if coin is already called`, async () => {
      const callDaoMock = {
        get: sinon.stub().returns(new Call())
      };
  
      const callAction = new CallAction({
        coin: new Coin({
          symbol: 'FOO',
          price_btc: .001
        }),
        user: new User()
      }, [{}], {}, callDaoMock);
  
      const result = await callAction.validate();
  
      expect(result).to.equal(`You are already calling FOO.`);
    });
  });

  describe(`execute`, () => {
    it(`should call a coin successfully`, async () => {
      const callDaoMock = {
        create: sinon.stub()
      };
  
      const callAction = new CallAction({
        coin: new Coin({
          price_btc: .001
        }),
        user: new User()
      }, [{}], {}, callDaoMock);
  
      await callAction.execute();
  
      expect(callDaoMock.create.calledOnce).to.be.true;
    });

    it(`should get self calls successfully`, async () => {
      const callDaoMock = {
        getByUserId: sinon.stub().returns([])
      };
  
      const callAction = new CallAction({
        user: new User(),
        flags: ['I']
      }, [{}], {}, callDaoMock);
  
      await callAction.execute();
  
      expect(callDaoMock.getByUserId.calledOnce).to.be.true;
    });

    it(`should get all calls successfully`, async () => {
      const callDaoMock = {
        getAll: sinon.stub().returns([])
      };
  
      const callAction = new CallAction({
        user: new User(),
        flags: []
      }, [{}], {}, callDaoMock);
  
      await callAction.execute();
  
      expect(callDaoMock.getAll.calledOnce).to.be.true;
    });

    it(`should delete a call successfully`, async () => {
      const callDaoMock = {
        remove: sinon.stub()
      };
  
      const callAction = new CallAction({
        user: new User(),
        coin: new Coin({
          price_btc: .001
        }),
        flags: ['D']
      }, [{}], {}, callDaoMock);
  
      await callAction.execute();
  
      expect(callDaoMock.remove.calledOnce).to.be.true;
    });

    it(`should delete all calls successfully`, async () => {
      const callDaoMock = {
        removeByUserId: sinon.stub()
      };
  
      const callAction = new CallAction({
        user: new User(),
        flags: ['D', 'A']
      }, [{}], {}, callDaoMock);
  
      await callAction.execute();
  
      expect(callDaoMock.removeByUserId.calledOnce).to.be.true;
    });
  });

});