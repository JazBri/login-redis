module.exports = {
  showUsers: `SELECT * FROM users`,
  insertUser: `INSERT INTO users (userName, password, mailUser) VALUES (?, ?, ?)`,
  getUserByMailPass: `SELECT * FROM users WHERE mailUser = (?) AND password = (?);`,
  getUserByMail: `SELECT * FROM users WHERE mailUser = (?);`
};
