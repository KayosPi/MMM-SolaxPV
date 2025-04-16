// node_helper.js — Handles Solax API v2 requests
const NodeHelper = require("node_helper");
const https = require("https");

module.exports = NodeHelper.create({
  socketNotificationReceived(notification, payload) {
    if (notification === "GET_SOLAX_DATA_V2") {
      const token = payload.token;
      const wifiSn = payload.wifiSn;

      const data = JSON.stringify({ wifiSn });

      const options = {
        hostname: "www.solaxcloud.com",
        port: 443,
        path: "/api/v2/dataAccess/realtimeInfo/get",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
          "tokenId": token
        }
      };

      const req = https.request(options, res => {
        let responseData = "";
        res.on("data", chunk => responseData += chunk);
        res.on("end", () => {
          try {
            const json = JSON.parse(responseData);
            if (json.success && json.result) {
              this.sendSocketNotification("SOLAX_DATA_V2", json.result);
            } else {
              console.error("[MMM-SolaxPV2] Invalid API response:", json);
            }
          } catch (e) {
            console.error("[MMM-SolaxPV2] JSON parse error:", e);
          }
        });
      });

      req.on("error", err => {
        console.error("[MMM-SolaxPV2] API request failed:", err);
      });

      req.write(data);
      req.end();
    }
  }
});
