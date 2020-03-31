module.exports = {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || "6379"
  },
  tokenTime: process.env.TOKEN_TIME || 3000,
  resetTime: process.env.RESET_TIME || 3000
};
