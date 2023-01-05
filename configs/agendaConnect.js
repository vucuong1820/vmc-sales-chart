/* eslint-disable no-console */
// const { crawlData } = require('../helpers/test');
const crawlData = require('../helpers/crawlDataBackend');
const agenda = require('agenda');

const agendaInstance = new agenda({
  db: { address: process.env.MONGO_URI, collection: 'agenda-jobs' },
});

async function run() {
  console.log('[AGENDA]: RUN AGENDA');
  agendaInstance.define('crawl theme data', async (job) => {
    console.log('=======================');
    console.log('[AGENDA]: AUTO CRAWL THEME DATA 20:00');
    await crawlData();
  });

  (async function () {
    const crawlThemeData = agendaInstance.create('crawl theme data');
    await agendaInstance.start();
    await crawlThemeData
      .repeatEvery('59 19 * * *', {
        timezone: 'Australia/Sydney',
      })
      .save();
  })();
}

module.exports = run;
