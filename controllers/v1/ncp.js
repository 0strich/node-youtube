const axios = require("axios");
// utils
const cwr = require("src/utils/createWebResp");
const fn = require("src/utils/functions");
// config
const ncp = require("src/config/ncpConfig");
const { generateOTP } = require("../../utils/crypt");

// 문자 발송
const postSendMessage = async (req, res) => {
  try {
    const { sms, headers } = ncp;

    const method = "POST";
    const url = `${sms.host}${sms.sendMessage}`;
    const signatureURL = sms.sendMessage;
    const config = { headers: headers(method, signatureURL) };
    const body = {
      type: "SMS",
      contentType: "COMM",
      countryCode: "82",
      from: "01024998196",
      content: "new update",
      messages: [{ to: "01024998196" }],
    };

    const response = await axios.post(url, body, config);
    return cwr.createWebResp(res, 200, response.data);
  } catch (error) {
    return cwr.errorWebResp(res, 403, `E0000 - postSendMessage`, error.message);
  }
};

// OTP 발송
const postOTP = async (req, res) => {
  try {
    const { sms, headers } = ncp;
    const { phoneNumber } = req.body;
    const { OTP } = req.models.v1;

    // 1. OTP + 문구 생성
    const serviceName = "일하루";
    const otp = generateOTP();
    const content = fn.generateOtpContent(serviceName, otp);

    // 2. OTP 및 정보 DB 저장
    const optDocs = await OTP.create({ otp });
    console.log("optDocs: ", optDocs);

    // 3. OTP 문자 발송
    const method = "POST";
    const url = `${sms.host}${sms.sendMessage}`;
    const signatureURL = sms.sendMessage;
    const config = { headers: headers(method, signatureURL) };
    const body = fn.generateSMSBody(phoneNumber, content);

    const response = await axios.post(url, body, config);
    return cwr.createWebResp(res, 200, response.data);
  } catch (error) {
    return cwr.errorWebResp(res, 403, `E0000 - postSendMessage`, error.message);
  }
};

// OTP 검증
const postOTPVerify = async (req, res) => {
  try {
    const { OTP } = req.models.v1;

    const otpData = await OTP.findOne({ userId: userId });
    if (!otpData) {
      return "Invalid user";
    }

    if (new Date() > otpData.expiry) {
      return "OTP expired";
    }

    if (otpData.attempts >= 3) {
      // 최대 시도 횟수 3회로 설정
      return "Maximum attempts reached";
    }

    if (inputOTP !== otpData.otp) {
      otpData.attempts += 1;
      await otpData.save();
      return "Incorrect OTP";
    }

    // OTP 검증 성공, OTP 데이터 삭제
    await OTP.deleteOne({ userId: userId });

    return cwr.createWebResp(res, 200, response.data);
  } catch (error) {
    return cwr.errorWebResp(res, 403, `E0000 - postSendMessage`, error.message);
  }
};

module.exports = {
  postSendMessage,
  postOTP,
  postOTPVerify,
};
