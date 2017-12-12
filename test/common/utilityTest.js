const utility = require('../../src/common/utility.js');

describe(`utility`, () => {

  describe(`moneyFormat`, () => {

    it(`should support larger than one billion`, () => {
      expect(utility.moneyFormat(1000000000)).to.equal('1.000B');
    });

    it(`should support larger than one million`, () => {
      expect(utility.moneyFormat(1000000)).to.equal('1.000M');
    });

    it(`should support larger than one thousand`, () => {
      expect(utility.moneyFormat(1000)).to.equal('1.000K');
    });

    it(`should support less than one thousand`, () => {
      expect(utility.moneyFormat(100)).to.equal('100.000');
    });

    it(`should format to three places`, () => {
      expect(utility.moneyFormat(1234000000)).to.equal('1.234B');
    });

    it(`should handle negatives`, () => {
      expect(utility.moneyFormat(-1234000000)).to.equal('-1.234B');
    });
  });

  describe(`toFloat`, () => {
    it(`should properly parse out commas`, () => {
      const value = utility.toFloat(`1,000.00`);
      expect(value).to.equal(1000.00);
    });
  });

});