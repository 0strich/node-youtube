const express = require("express");
const router = express.Router();

// 사용자 라우터
const userRouter = require("./users");
const youtubeRouter = require("./youtube");
const ncpRouter = require("./ncp");

// 사용자 라우터
router.use(`/users`, userRouter);
router.use(`/youtube`, youtubeRouter);
router.use(`/ncp`, ncpRouter);

module.exports = router;
