const { expect } = require('chai');
const Positions = require('../../src/position/positions.js');

describe(`Positions`, () => {

  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const positions = new Positions();

      expect(positions).not.to.be.null;
    });

    it(`should initialize with a single position when given a set of one position`, () => {
      const positions = new Positions({ coinId: `BMC`, username: `MeoMix`, amount: 10, price: 2 });

      expect(positions.length).to.equal(1);
      expect(positions[0].coinId).to.equal(`BMC`);
    });
  });

  describe(`increase`, () => {
    it(`it should add a new position if no match found`, async () => {
      const positions = new Positions();

      await positions.increase(`BMC`, `MeoMix`, 10, 20);

      expect(positions[0].amount).to.equal(20);
    });

    it(`it should merge positions if a match is found`, async () => {
      const positions = new Positions();
      
      await positions.increase(`BMC`, `MeoMix`, 10, 20);
      await positions.increase(`BMC`, `MeoMix`, 10, 20);

      expect(positions.length).to.equal(1);
    });

    it(`it should average positions when merging a smaller price`, async () => {
      const positions = new Positions();

      await positions.increase(`BMC`, `MeoMix`, 20, 20);
      await positions.increase(`BMC`, `MeoMix`, 10, 20);

      expect(positions[0].amount).to.equal(40);
      expect(positions[0].price).to.equal(15);
    });

    it(`it should average positions when merging a larger price`, async () => {
      const positions = new Positions();

      await positions.increase(`BMC`, `MeoMix`, 10, 20);
      await positions.increase(`BMC`, `MeoMix`, 20, 20);

      expect(positions[0].amount).to.equal(40);
      expect(positions[0].price).to.equal(15);
    });
  });

  describe(`decrease`, () => {
    it(`should do nothing if no position exists`, async () => {
      const positions = new Positions();

      await positions.decrease(`BMC`, `MeoMix`, 20);

      expect(positions.length).to.equal(0);
    });

    it(`should do nothing if existing amount is too small`, async () => {
      const positions = new Positions({ coinId: `BMC`, username: `MeoMix`, amount: 5 });

      await positions.decrease(`BMC`, `MeoMix`, 20);

      expect(positions.length).to.equal(1);
    });

    it(`should decrease position if amount is smaller than exisiting position`, async () => {
      const positions = new Positions({ coinId: `BMC`, username: `MeoMix`, amount: 25 });
      
      await positions.decrease(`BMC`, `MeoMix`, 20);

      expect(positions[0].amount).to.equal(5);
    });

    it(`should remove position if amount is equal to existing position`, async () => {
      const positions = new Positions({ coinId: `BMC`, username: `MeoMix`, amount: 20 });
      
      await positions.decrease(`BMC`, `MeoMix`, 20);

      expect(positions.length).to.equal(0);
    });
  });

});