const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const PORT = 3000;
const app = next({ dev, hostname, PORT });
const handle = app.getRequestHandler();
const schedule = require("node-schedule");
const crawlData = require("./helpers/crawlData.js");
require("dotenv").config();
console.log("======>", process.env.TIME);
const job = schedule.scheduleJob("0 51 14 * * 0-6", async () => {
  await crawlData();
});
//Ex: process.env.TIME=0 22 9 * * 0-6 ===> 9h22'0s am, Mon-Sun
app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${PORT}`);
  });
});
