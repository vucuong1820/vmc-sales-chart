import schedule from "node-schedule";
import { crawlData } from "../../helpers/crawlData";

export default async function handler(req, res) {
  res.setHeader("Allow", "GET");
  await crawlData();
  res.status(405).end("Method Not Allowed");
}
