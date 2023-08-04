module.exports = {
  v1: {
    uri: `mongodb://${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}`,
    dbName: process.env.MONGODB_DB_NAME_V1,
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASSWORD,
  },
  v2: {
    uri: `mongodb://${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}`,
    dbName: process.env.MONGODB_DB_NAME_V2,
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASSWORD,
  },
};
