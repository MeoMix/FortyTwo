const sinon = require('sinon');
const fs = require('mz/fs');

before(() => {
  sinon.stub(fs, 'readFile');
  sinon.stub(fs, 'writeFile');
});