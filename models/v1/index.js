const User = require("./users");
const OTP = require("./otp");

module.exports = (connection) => ({
  User: User(connection),
  OTP: OTP(connection),
});
