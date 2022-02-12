import schedule from "node-schedule";
import { crawlData } from "../../helpers/crawlData";

export default async function handler(req, res) {
  const data = await crawlData();
  res.json(data);
}
