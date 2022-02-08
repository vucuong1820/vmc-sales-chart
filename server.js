const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const PORT = 3000;
const app = next({ dev, hostname, PORT });
const handle = app.getRequestHandler();
const puppeteer = require("puppeteer");

// Crawl data automatically
const automation = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("http://localhost:3000", {
    waitUntil: "networkidle2",
  });
  await browser.close();
};
let now = new Date();
let timer =
  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 5, 0, 0) -
  now;

setInterval(() => setTimeout(() => automation(), timer), 20000);

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
