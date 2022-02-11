import schedule from "node-schedule";
import { crawlData } from "../../helpers/crawlData";

export default async function handler(req, res) {
  setInterval(async () => await crawlData(), 5000);
}
