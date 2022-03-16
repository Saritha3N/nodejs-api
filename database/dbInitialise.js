const config = require('../src/config/config');
const mysql = require('mysql');
var Sequelize = require('sequelize');
const model = require("../database/models");


module.exports = {
    initialize
};
async function initialize() {
   
    
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
    // sync all models with database
    await sequelize.sync();
}