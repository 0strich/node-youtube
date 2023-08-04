const cwr = require("src/utils/createWebResp");
const fs = require("fs");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
// config
const ncp = require("src/config/ncpConfig");

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost/v1/youtube/oauth2callback"
);

const youtube = google.youtube({ version: "v3", auth: oauth2Client });

// Generate a URL that asks permissions for YouTube scopes
const scopes = [
  "https://www.googleapis.com/auth/youtube.force-ssl",
  "https://www.googleapis.com/auth/youtube",
];

// Oauth 로그인 이동
const getOauthUrl = async (req, res) => {
  try {
    const options = { access_type: "offline", scope: scopes };
    const url = oauth2Client.generateAuthUrl(options);
    res.redirect(url);
    // return cwr.createWebResp(res, 200, { success: true });
  } catch (error) {
    return cwr.errorWebResp(res, 403, `E0000 - getOauthUrl`, error.message);
  }
};

// Oauth callback
const getOauthCallback = async (req, res) => {
  try {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);

    return cwr.createWebResp(res, 200, { success: true });
  } catch (error) {
    return cwr.errorWebResp(res, 403, `E0000 - getOauth`, error.message);
  }
};

// 유튜브 영상 업로드
const postYoutube = async (req, res) => {
  try {
    const { title, description } = req.body;
    const videoPath = req.files["video"][0].path;
    const thumbnailPath = req.files["thumbnail"][0].path;

    // 1. 영상 업로드
    const video = await youtube.videos.insert({
      part: "id,snippet,status",
      requestBody: {
        snippet: { title, description },
        status: { privacyStatus: "public" },
      },
      media: { body: fs.createReadStream(videoPath) },
    });

    const videoId = video.data.id; // 업로드된 동영상의 videoId

    // 2. 썸네일 설정
    await youtube.thumbnails.set({
      videoId: videoId,
      media: {
        mimeType: "image/jpeg",
        body: fs.createReadStream(thumbnailPath),
      },
    });

    // Clean up the uploaded files from the server
    fs.unlinkSync(videoPath);
    fs.unlinkSync(thumbnailPath);

    return cwr.createWebResp(res, 200, { videoId });
  } catch (error) {
    return cwr.errorWebResp(res, 403, `E0000 - postYoutube`, error.message);
  }
};

// 유튜브 영상 수정
const patchYoutube = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const { title, description } = req.body;

    const videoResource = {
      id: videoId,
      snippet: {
        title: title,
        description: description,
        categoryId: "22", // Update the category as per requirement
      },
    };

    const videoUpdate = { part: "snippet", resource: videoResource };
    const response = await youtube.videos.update(videoUpdate);

    return cwr.createWebResp(res, 200, response);
  } catch (error) {
    return cwr.errorWebResp(res, 403, `E0000 - postYoutube`, error.message);
  }
};

// 유튜브 영상 삭제
const deleteYoutube = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const response = await youtube.videos.delete({ id: videoId });

    return cwr.createWebResp(res, 200, response);
  } catch (error) {
    return cwr.errorWebResp(res, 403, `E0000 - postYoutube`, error.message);
  }
};

module.exports = {
  getOauthUrl,
  getOauthCallback,
  postYoutube,
  patchYoutube,
  deleteYoutube,
};
