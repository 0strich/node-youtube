const express = require("express");
const router = express.Router();
const controller = require("src/controllers/v1/ncp");

// 문자 발송
router.post("/sendMessage", controller.postSendMessage);

// OTP 발송
router.post("/otp", controller.postOTP);

// OTP 검증
router.post("/otp/verify", controller.postOTPVerify);

module.exports = router;
