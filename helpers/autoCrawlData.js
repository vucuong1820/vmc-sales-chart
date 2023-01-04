/* eslint-disable no-console */
import { schedule } from 'node-cron';
import { crawlData } from './crawlData';

// schedule crawl every 8 p.m  in timezone Australia/Sydney
const crawlJob = schedule(
  '* 20 * * *',
  () => {
    console.log('=======================');
    console.log('[AUTO CRAWL THEME DATA] \n');
    crawlData();
  },
  {
    scheduled: false,
    timezone: 'Australia/Sydney',
  },
);

export default crawlJob;
