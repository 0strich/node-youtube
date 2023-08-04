const User = require("./users");

module.exports = (connection) => ({
  User: User(connection),
});
