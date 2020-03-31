const db = require("../config/connection");
const utils = require("../helpers/utils");
const redisS = require("../service/redis");
const configRedis = require("../config/redisConfig");
const crypto = require("crypto");
const query = require("./queries");
const nodemailer = require("nodemailer");

//Functions delete, show, control
exports.delete = (req, res) => {
  db.connection.query(`DELETE FROM users WHERE id = ${req.params.id}`);
  if (err) throw err;
  res.json({ users: rows });
};

exports.show = (req, res) => {
  console.log("Entra");

  db.connection.query(query.showUsers, function(err, rows, fields) {
    if (err) throw err;
    res.json({ users: rows });
  });
};

//Login
exports.login = (req, res) => {
  const { userName, password, mailUser } = req.body;
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  console.log("USER ", userName, password, mailUser);

  db.connection.query(
    query.getUserByMailPass,
    [mailUser, hashedPassword],
    function(err, rows) {
      if (err) throw err;
      if (!rows.length) {
        return res.status(400).send("User not found.");
      }
      //res.json(rows);
      const token = utils.generateString(28);
      const result = rows[0];
      console.log("Token", token);
      redisS.insert(
        `TOKEN_${token}`,
        JSON.stringify(result),
        configRedis.tokenTime,
        err => {
          if (err) {
            return res.status(500).send("Internal Server Error.");
          }
          const resp = {
            user: {
              id: result.id,
              userName: result.userName,
              pass: result.password,
              mail: result.mailUser
            },
            access_token: token
          };

          res.send(resp);
        }
      );
    }
  );
};

//Register
exports.register = (req, res) => {
  const { userName, password, mailUser } = req.body;
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  db.connection.query(
    query.insertUser,
    [userName, hashedPassword, mailUser],
    function(err, results) {
      if (err) throw err;
      res.json(results);
    }
  );
};

//Logout
exports.logOut = (req, res) => {
  //const { token } = req.session;
  console.log("TOKEN", req.session);
};

//Reset
//Busca un usuario por nombre y crea un token.
exports.reset = (req, res) => {
  const { userName, mailUser } = req.body;
  //console.log(userName, mailUser);

  db.connection.query(query.getUserByMail, [mailUser], function(err, rows) {
    if (err) throw err;
    if (!rows.length) {
      return res.status(400).send("User not found.");
    }

    //Crea un token para enviarlo al usuario
    const token = utils.generateString(28);
    const result = rows[0];
    //  console.log("Token", token);
    redisS.insert(
      `TOKEN_${token}`,
      JSON.stringify(result),
      configRedis.tokenTime,
      err => {
        if (err) {
          return res.status(500).send("Internal Server Error.");
        }
        //Envía el token al usuario
        // let smtpTransport = nodemailer.createTransport("SMTP", {
        //   service: "GMAIL",
        //   auth: {
        //     user: "briascojazmin@gmail.com",
        //     pass: "123"
        //   }
        // });

        // let message = {
        //   from: "Jaz",
        //   to: "briascojazmin@gmail.com", //mailuser
        //   subject: "Hola!",
        //   text: "Esto esta funcionando"
        // };

        // smtpTransport.sendMail(message, function(err, res) {
        //   if (err) {
        //     console.log("Error");
        //   } else {
        //     send(res.message);
        //     console.log("Message sent: ", res.message);
        //   }
        // });
        const resp = {
          user: {
            mail: result.mailUser,
            userName: result.userName,
            pass: result.password,
            id: result.id
          },
          new_access_token: token
        };
        res.send(resp);
      }
    );
    //Devuelve el usuario según el token
    //    console.log("TOKEN", token);
    const r = rows[0];
    redisS.get(`TOKEN_${token}`, cb => {
      if (err) {
        return res.status(500).send("Internal Server Error.");
      } else {
        //    console.log(r);
      }
    });
  });
};

exports.update = (req, res, err) => {
  const token = req.body;
  console.log("TOKEN", token);

  //const r = rows[0];
  redisS.get(`TOKEN_${token}`, cb => {
    if (err) {
      return res.status(500).send("Internal Server Error.");
    }
    // } else {
    //   console.log("row:", r);
    // }
  });
};
