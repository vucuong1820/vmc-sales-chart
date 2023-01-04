/* eslint-disable no-console */
import { CRON_STATUS } from '@constants/cron';
import crawlJob from '@helpers/autoCrawlData';

export default async function handler(req, res) {
  const cronJobStatus = crawlJob.getStatus();

  if (!cronJobStatus || cronJobStatus === CRON_STATUS.STOPPED) {
    crawlJob.start();
  }

  res.json();
}
