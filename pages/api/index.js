import schedule from "node-schedule";
import { crawlData } from "../../helpers/crawlData";

export default async function handler(req, res) {
  const job = schedule.scheduleJob("*/20 * * * *", async () => {
    await crawlData();
  });
}
