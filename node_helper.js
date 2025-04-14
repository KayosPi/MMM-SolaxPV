
const NodeHelper = require("node_helper");
const https = require("https");

module.exports = NodeHelper.create({
  socketNotificationReceived(notification, payload) {
    if (notification === "GET_SOLAX_DATA") {
      const token = payload.token;
      const sn = payload.sn;
      const query = `tokenId=${token}&sn=${sn}`;
      const options = {
        hostname: "global.solaxcloud.com",
        port: 9443,
        path: `/proxy/api/getRealtimeInfo.do?${query}`,
        method: "GET"
      };

      const req = https.request(options, res => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.success && json.result) {
              this.sendSocketNotification("SOLAX_DATA", json.result);
            } else {
              console.error("[MMM-SolaxPV] Invalid API response:", json);
            }
          } catch (e) {
            console.error("[MMM-SolaxPV] Failed to parse JSON:", e);
          }
        });
      });

      req.on("error", err => {
        console.error("[MMM-SolaxPV] API request failed:", err);
      });

      req.end();
    }
  }
});
