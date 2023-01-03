import cron from 'node-cron';
import { crawlData } from './crawlData';

// schedule crawl every 8 p.m  in timezone Australia/Sydney
const crawlJob = cron.schedule(
  '0 20 * * *',
  () => {
    crawlData();
  },
  {
    scheduled: false,
    timezone: 'Australia/Sydney',
  },
);

export default crawlJob;
