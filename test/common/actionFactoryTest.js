const ActionFactory = require('../../src/common/actionFactory.js');

describe(`ActionFactory`, () => {

  it(`should instantiate`, () => {
    const actionFactory = new ActionFactory({}, {}, {}, {});

    expect(actionFactory).to.exist;
  });

});