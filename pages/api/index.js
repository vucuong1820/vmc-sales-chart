import schedule from "node-schedule";
import { crawlData } from "../../helpers/crawlData";

export default async function handler(req, res) {
  setTimeout(async () => await crawlData(), 10000);
}
