const mongoose = require("mongoose");
const cwr = require("./createWebResp");
const { errors } = require("./errors");
const { v1, v2 } = require("src/config/dbConfig");
// models
const v1Models = require("src/models/v1");
// const v2Models = require("src/models/v2");

const connectOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  socketTimeoutMS: 5 * 60 * 1000, // socket timeout 5 minutes
};

const connectDB = async (DB_INFO) => {
  const { dbName, user, pass } = DB_INFO;
  const dbOptions = { dbName, user, pass };
  const options = { ...connectOptions, ...dbOptions };

  const connection = mongoose.createConnection(DB_INFO.uri, options);
  return connection;
};

const connectAllDBs = async () => {
  return {
    v1Connection: await connectDB(v1),
    // v2Connection: await connectDB(v2),
  };
};

// middleWare 사용
const tryConnectDB = async (req, res, next) => {
  try {
    const connections = await connectAllDBs();
    req.models = {
      v1: v1Models(connections.v1Connection),
      // v2: v2Models(connections.v2Connection),
    };
    next();
  } catch (error) {
    console.log("error: ", error);
    cwr.errorWebResp(res, 500, errors.E91000, error);
  }
};

const close = () => {
  mongoose.connection.close();
};

module.exports = {
  connectAllDBs,
  tryConnectDB,
  close,
};
