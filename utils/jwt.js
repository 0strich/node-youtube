const jwt = require("jsonwebtoken");
const webResponse = require("./webResponse");

const isLoggedIn = (req, res, next) => {
  const bearerJwt = req.headers.authorization || req.headers.Authorization;
  let token;
  if (bearerJwt.startsWith("Bearer ")) {
    token = bearerJwt.slice(7, bearerJwt.length).trimLeft();
  }
  if (!token) {
    const response = new webResponse();
    response.code = 401;
    response.message = "E1003 - Bearer 확인";
    return res.status(401).json(response.create());
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const response = new webResponse();
      response.code = 401;
      response.message = "E1002 - 유저 인증 토큰 오류";
      return res.status(401).json(response.create());
    }
    req.decoded = decoded;
    next();
  });
};

const jwtSourceToTokenInAdmin = (payload) =>
  new Promise((resolve, reject) => {
    const secretOrPrivateKey = process.env.ADMIN_JWT_SCRET;
    const options = { expiresIn: 60 * 60 * 24 * 90 };
    jwt.sign(payload, secretOrPrivateKey, options, (err, token) => {
      if (err) {
        reject({ code: 500, message: err });
      } else {
        resolve({
          jwt: token,
          userId: payload.userId,
          type: payload.type,
          email: payload.email,
          name: payload.name,
          cs: payload.cs,
        });
      }
    });
  });

module.exports = {
  isLoggedIn,
  jwtSourceToTokenInAdmin,
};
