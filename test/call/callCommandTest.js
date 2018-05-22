const CallCommand = require('../../src/call/callCommand.js');
const Call = require('../../src/call/call.js');
const Coin = require('../../src/coin/coin.js');
const User = require('../../src/user/user.js');
const sinon = require('sinon');

describe(`CallCommand`, () => {

  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const callDaoMock = {};
      const callCommand = new CallCommand({}, {}, {}, callDaoMock);

      expect(callCommand).not.to.be.null;
    });
  });

  describe(`validate`, () => {
    it(`should error when deleting without a coin or the 'delete all' flag`, async () => {
      const callDaoMock = {
        get: sinon.stub()
      };
  
      const callCommand = new CallCommand({
        values: ['XLM'],
        flags: ['D'],
        user: new User()
      }, null, {}, callDaoMock);
  
      const result = await callCommand.validate();
  
      expect(result).to.equal(`No coin found.`);
    });

    it(`should error when calling with a price of zero`, async () => {
      const callDaoMock = {
        get: sinon.stub()
      };
  
      const callCommand = new CallCommand({
        values: ['XLM', '0'],
        user: new User()
      }, new Coin({
        symbol: 'FOO'
      }), {}, callDaoMock);
  
      const result = await callCommand.validate();
  
      expect(result).to.equal(`Price must be greater than zero.`);
    });

    it(`should error when calling with a negative price`, async () => {
      const callDaoMock = {
        get: sinon.stub()
      };
  
      const callCommand = new CallCommand({
        values: ['XLM', '-1.0'],
        user: new User()
      }, new Coin({
        symbol: 'FOO'
      }), {}, callDaoMock);
  
      const result = await callCommand.validate();
  
      expect(result).to.equal(`Price must be greater than zero.`);
    });

    it(`should return an error if coin is already called`, async () => {
      const callDaoMock = {
        get: sinon.stub().returns(new Call())
      };
  
      const callCommand = new CallCommand({
        user: new User()
      }, new Coin({
        symbol: 'FOO'
      }), {}, callDaoMock);
  
      const result = await callCommand.validate();
  
      expect(result).to.equal(`You are already calling FOO.`);
    });
  });

  describe(`execute`, () => {
    it(`should call a coin successfully`, async () => {
      const callDaoMock = {
        create: sinon.stub()
      };
  
      const callCommand = new CallCommand({
        user: new User()
      }, new Coin(), {}, callDaoMock);
  
      await callCommand.execute();
  
      expect(callDaoMock.create.calledOnce).to.be.true;
    });

    it(`should get self calls successfully`, async () => {
      const callDaoMock = {
        getByUserId: sinon.stub().returns([]),
        create: sinon.stub()
      };
  
      const callCommand = new CallCommand({
        user: new User(),
        flags: ['I']
      }, null, {}, callDaoMock);
  
      await callCommand.execute();
  
      expect(callDaoMock.getByUserId.calledOnce).to.be.true;
    });

    it(`should get all calls within date range successfully`, async () => {
      const callDaoMock = {
        getWithinDateRange: sinon.stub().returns([]),
        create: sinon.stub()
      };
  
      const callCommand = new CallCommand({
        user: new User(),
        flags: []
      }, null, {}, callDaoMock);
  
      await callCommand.execute();
  
      expect(callDaoMock.getWithinDateRange.calledOnce).to.be.true;
    });

    it(`should delete a call successfully`, async () => {
      const callDaoMock = {
        remove: sinon.stub()
      };
  
      const callCommand = new CallCommand({
        user: new User(),
        flags: ['D']
      }, new Coin(), {}, callDaoMock);
  
      await callCommand.execute();
  
      expect(callDaoMock.remove.calledOnce).to.be.true;
    });

    it(`should delete all calls successfully`, async () => {
      const callDaoMock = {
        removeByUserId: sinon.stub()
      };
  
      const callCommand = new CallCommand({
        user: new User(),
        flags: ['D', 'A']
      }, null, {}, callDaoMock);
  
      await callCommand.execute();
  
      expect(callDaoMock.removeByUserId.calledOnce).to.be.true;
    });
  });

});