const proxyquire = require('proxyquire');
const { random } = require('lodash');
const chai = require('chai');

global.expect = chai.expect;

proxyquire('../src/common/database.js', {
  mysql: {
    createConnection(){
      return {
        query(sql, entity, callback){
          if(sql.includes('INSERT')){
            callback('', { insertId: random(1, 9999) });
          } else {
            callback('', {});
          }
        }
      };
    }
  }
});