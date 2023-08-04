const axios = require("axios");
// utils
const cwr = require("src/utils/createWebResp");
// config
const ncp = require("src/config/ncpConfig");

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
    console.log("error: ", error);
    return cwr.errorWebResp(res, 403, `E0000 - postSendMessage`, error.message);
  }
};

module.exports = {
  postSendMessage,
};
