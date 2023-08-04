const express = require("express");
const router = express.Router();
const controller = require("src/controllers/v1/ncp");

router.post("/sendMessage", controller.postSendMessage);

module.exports = router;
