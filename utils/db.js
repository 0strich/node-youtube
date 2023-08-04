const Promise = require("promise");
const mongoose = require("mongoose");
const cwr = require("./createWebResp");
const config = require("../config/dbConfig");

const MONGODB_NAME = config.mongodb_name;
const MONGODB_USER = config.mongodb_user;
const MONGODB_PASSWORD = config.mongodb_password;
const MONGODB_URL = config.mongodb_url;

const connect = (DB_URI) =>
  new Promise((resolve, reject) => {
    if (mongoose.connection.readyState) {
      // console.log("mongoose.connection.readyState");
      resolve(mongoose.connection);
    } else {
      mongoose
        .connect(DB_URI, {
          user: MONGODB_USER,
          pass: MONGODB_PASSWORD,
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex: true,
          socketTimeoutMS: 5 * 60 * 1000, // socket timeout 5 minutes
        })
        .then((connection) => {
          console.log("Success DB Connection");
          resolve(connection);
        })
        .catch((err) => {
          console.log("connection error : ", err);
          reject(err);
        });
    }
  });

exports.connectDB = async () => {
  const DB_URI = `mongodb://${MONGODB_URL}/${MONGODB_NAME}`;
  console.log("DB URI : ", DB_URI);
  try {
    await connect(DB_URI);
  } catch (error) {
    console.log("E0000 - DB 연결 오류 : ", error);
  }
};

// middleWare 사용
exports.tryConDB = async (req, res, next) => {
  await this.connectDB().catch((error) => {
    cwr.errorWebResp(res, 500, "E0000 - DB 연결 오류", error);
  });
  next();
};

exports.close = () => {
  mongoose.connection.close();
};
