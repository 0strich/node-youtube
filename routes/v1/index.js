const express = require("express");
const router = express.Router();

// 사용자 라우터
const userRouter = require("./users");

// 사용자 라우터
router.use(`/users`, userRouter);

module.exports = router;
