const { expect } = require('chai');
const Query = require('../../src/query/query.js');

describe(`Query`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const query = new Query();

      expect(query).not.to.be.null;
    });
  });

});