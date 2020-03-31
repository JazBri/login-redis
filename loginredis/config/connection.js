const mysql = require("mysql");

var connection = mysql.createConnection({
  host: process.env.DB_HOST || 3000,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "user",
  database: process.env.DB_NAME || "auth_db"
});

connection.connect(err => {
  if (err) {
    console.log("Error connecting to Db" + err);
    return;
  }
  console.log("Connection established");
});

exports.connection = connection;
