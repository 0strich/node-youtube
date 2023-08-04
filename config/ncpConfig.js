const { timestamp } = require("src/utils/functions");
const { makeSignature } = require("src/utils/crypt");

module.exports = {
  // keys
  accessKey: process.env.NAVER_ACCESS_KEY,
  secretKey: process.env.NAVER_SECRET_KEY,
  serviceID: process.env.NAVER_SMS_SERVICE_ID,
  // host
  sms: {
    host: "https://sens.apigw.ntruss.com",
    sendMessage: `/sms/v2/services/${process.env.NAVER_SMS_SERVICE_ID}/messages`,
  },
  // config
  headers: (method, url) => ({
    "Content-Type": "application/json; charset=utf-8",
    "x-ncp-apigw-timestamp": timestamp,
    "x-ncp-iam-access-key": process.env.NAVER_ACCESS_KEY,
    "x-ncp-apigw-signature-v2": makeSignature(
      method,
      url,
      process.env.NAVER_ACCESS_KEY,
      process.env.NAVER_SECRET_KEY
    ),
  }),
};
