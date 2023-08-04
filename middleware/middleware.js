const cwr = require("../utils/createWebResp");

// 계정 유무 체크
const isUserExist = async (req, res, next) => {
  try {
    const { _id, ...decoded } = req.decoded;
    const userDoc = await User.findById(_id).lean();

    if (!userDoc) {
      return cwr.errorWebResp(res, 403, errors.E01000);
    }

    // decoded에 userId 추가
    req.decoded = { userId: _id, ...decoded };

    next();
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E01009, error.message);
  }
};

module.exports = {
  isUserExist,
};
