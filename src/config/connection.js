const mysql = require("mysql");

const conn = mysql.createConnection({
  //user: "root",
  user: "aldi",
  password: "Lodaya789",
  host: "localhost",
  //host: "db4free.net",
  database: "dbprojekakhiraldi",
  port: "3306"
});

module.exports = conn;
