const { expect } = require('chai');
const State = require('../../src/common/state.js');

describe(`State`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const state = new State();

      expect(state).not.to.be.null;
    });
  });

});