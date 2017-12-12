const mysql = require('mysql');
const logger = require('../common/logger.js');

const isProduction = process.env.NODE_ENV === 'production';
const config = {
  user: isProduction ? process.env.SQL_USER : 'root',
  password: isProduction ? process.env.SQL_PASSWORD : '',
  database: isProduction ? process.env.SQL_DATABASE : 'fortytwo',
};

if (process.env.INSTANCE_CONNECTION_NAME && isProduction) {
  config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

const connection = mysql.createConnection(config);

module.exports = {

  async createEntity(tableName, domainEntity){
    if(domainEntity.id){
      logger.error(`Failed to create entity for ${tableName}. Id already set.`);
      return;
    }

    return await new Promise((resolve, reject) => {
      connection.query(`INSERT INTO \`${tableName}\` SET ?`, domainEntity, (error, results) => {
        if(error){
          reject(error);
        } else {
          resolve(results.insertId);
        }
      });
    });
  },

  async updateEntity(tableName, domainEntity){
    if(!domainEntity.id){
      logger.error(`Failed to update entity for ${tableName}. No id.`);
      return;
    }

    return await new Promise((resolve, reject) => {
      connection.query(`UPDATE \`${tableName}\` SET ? WHERE id = ${domainEntity.id}`, domainEntity, (error, results) => {
        if(error){
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },

  async deleteEntity(tableName, id){
    return await new Promise((resolve, reject) => {
      connection.query(`DELETE FROM \`${tableName}\` where id = ${id}`, (error, results) => {
        if(error){
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },

  async getAllEntities(tableName){
    return await new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM \`${tableName}\``, (error, results) => {
        if(error){
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

};