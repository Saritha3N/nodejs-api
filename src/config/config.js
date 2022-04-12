
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
// connect dev db
const connection = new Sequelize(process.env.DATABASENAME, process.env.DBUSER, process.env.DBPASS, {
  host:  process.env.DBHOST,
  dialect: 'mysql',
  logging: false
});
const database = {
  host :  process.env.DBHOST,
  port : process.env.DBPORT,
  user : process.env.DBUSER,
  password : process.env.DBPASS,
  database : process.env.DATABASENAME
}
module.exports = {
  connection,
  Sequelize,
  bcrypt,
  validator,
  jwt,
  database
};