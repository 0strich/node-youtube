const {validationResult} = require('express-validator');
const cwr = require('../utils/createWebResp');

const returnParamVD = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    cwr.errorWebResp(res, 403, 'E1004 - Invalid Params', result.array());
  } else {
    next();
  }
};

module.exports = {
  returnParamVD,
};
