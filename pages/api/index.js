import schedule from "node-schedule";
import { crawlData } from "../../helpers/crawlData";

export default function handler(req, res) {
  const job = schedule.scheduleJob("*/10 * * * *", async () => {
    await crawlData();
  });
}
