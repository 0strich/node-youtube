const express = require("express");
const router = express.Router();
const controller = require("src/controllers/v1/youtube");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/geturl", controller.getOauthUrl);

router.get("/oauth2callback", controller.getOauthCallback);

router.post(
  "/",
  upload.fields([{ name: "video" }, { name: "thumbnail" }]),
  controller.postYoutube
);

router.get("/", controller.getVideoList);

router.patch("/:videoId", controller.patchYoutube);

router.delete("/:videoId", controller.deleteYoutube);

module.exports = router;
