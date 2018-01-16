const Position = require('../../src/position/position.js');

describe(`Position`, () => {

  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const position = new Position();

      expect(position).not.to.be.null;
    });

    it(`should set default values`, () => {
      const position = new Position();

      expect(position.coinId).to.equal('');
      expect(position.userId).to.equal('');
      expect(position.price).to.equal(0);
      expect(position.amount).to.equal(0);
      expect(position.purchasedOn).to.equal(null);
    });

    it(`should set default values`, () => {
      const position = new Position({ coinId: `BMC` });

      expect(position.coinId).to.equal(`BMC`);
      expect(position.userId).to.equal('');
      expect(position.price).to.equal(0);
      expect(position.amount).to.equal(0);
      expect(position.purchasedOn).to.equal(null);
    });

  });

});