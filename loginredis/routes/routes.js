module.exports = routes = app => {
  app.use("/auth", require("./auth.js"));
};
