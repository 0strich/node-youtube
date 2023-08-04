const crypto = require("crypto");
const CryptoJS = require("crypto-js");

// 평문 AES 암호화
const plainTextAESEncryption = (plainText, secret) => {
  return CryptoJS.AES.encrypt(plainText, secret).toString();
};

// 평문 AES 복호화
const plainTextAESDecryption = (plainText, secret) => {
  const bytes = CryptoJS.AES.decrypt(plainText, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Json Object 자료형 암호화
// 객체 예시 const object = [{id: 1}, {id: 2}]
const objectAESEncryption = (object, secret) => {
  return CryptoJS.AES.encrypt(JSON.stringify(object), secret).toString();
};

// Json Object 자료형 복호화
const objectAESDecryption = (object, secret) => {
  const bytes = CryptoJS.AES.decrypt(object, secret);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// salt 생성
const saltGenerator = () => {
  return Math.round(new Date().valueOf() * Math.random()).toString();
};

const toSha512Hash = async (plaintext, salt) =>
  await crypto
    .createHash("sha512")
    .update(plaintext + salt)
    .digest("hex");

const createHashString = async (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// 비밀번호 검증
const verify = async (password, hash, salt) => {
  const cmpHash = await toSha512Hash(password, salt);
  return hash === cmpHash ? true : false;
};

// ncp 시그니처 생성
const makeSignature = (method, url, accessKey, secretKey) => {
  const space = " "; // one space
  const newLine = "\n"; // new line

  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(accessKey);

  const hash = hmac.finalize();

  return hash.toString(CryptoJS.enc.Base64);
};

const generateOTP = () => {
  const num = Math.floor(Math.random() * 1000000); // 0 - 999999
  const otp = num.toString().padStart(6, "0"); // 6자리로 맞추기 위해 앞에 00추가
  return otp;
};

module.exports = {
  plainTextAESEncryption,
  plainTextAESDecryption,
  objectAESEncryption,
  objectAESDecryption,
  saltGenerator,
  toSha512Hash,
  createHashString,
  verify,
  makeSignature,
  generateOTP,
};
