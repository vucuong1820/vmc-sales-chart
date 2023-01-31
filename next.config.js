/* eslint-disable no-console */
/** @type {import('next').NextConfig} */
const crawlData = require('./nextConfigs/crawlData');
const cron = require('node-cron');
cron.schedule(
  '30 23 * * *',
  async function () {
    console.log('[CRON-JOB]: START CRAWL THEME DATA');
    console.log('[CRON-JOB]: TIME:', new Date().toISOString());
    await crawlData();
    console.log('[CRON-JOB]: FINISH CRAWL THEME DATA');
  },
  {
    timezone: 'Australia/Sydney',
  },
);

const nextConfig = {
  reactStrictMode: false,
};

module.exports = nextConfig;
