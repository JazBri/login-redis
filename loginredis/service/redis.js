const redis = require("redis");
const config = "../config/config.js";

exports.get = (key, cb) => {
  const client = redis.createClient(config.redis);

  client.on("error", function(err) {
    return cb(err);
  });

  client.get(key, function(err, result) {
    client.quit();
    return cb(err, result);
  });
};

exports.insert = (key, value, ttl, cb) => {
  const client = redis.createClient(config.redis);

  client.on("error", function(err) {
    return cb(err);
  });

  if (ttl) {
    client.set(key, value, "EX", ttl, function(err, result) {
      client.quit();
      return cb(err, result);
    });
  } else {
    client.set(key, value, function(err, result) {
      client.quit();
      return cb(err, result);
    });
  }
};

exports.delete = (key, cb) => {
  const client = redis.createClient(config.redis);

  client.on("error", function(err) {
    return cb(err);
  });

  client.del(key, function(err, result) {
    client.quit();
    return cb(err, result);
  });
};
