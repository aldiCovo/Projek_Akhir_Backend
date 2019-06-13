const mysql = require("mysql");

const conn = mysql.createConnection({
  user: "root",
  // user: "aldi",
  //password: "Lodaya789",
  password: "Mysql123",
  host: "localhost",
  //host: "db4free.net",
  database: "dbprojekakhiraldinew",
  port: "3306"
});

module.exports = conn;
