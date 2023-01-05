import Agenda from 'agenda';
import { crawlData } from './crawlData';

/* eslint-disable no-console */
const agendaInstance = new Agenda({
  db: { address: process.env.MONGO_URI, collection: 'agenda-jobs' },
});

async function agendaJob() {
  agendaInstance.define('crawl theme data', async (job, done) => {
    console.log('=======================');
    console.log('[AGENDA]: AUTO CRAWL THEME DATA');
    await crawlData();
  });

  (async function () {
    const crawlThemeData = agendaInstance.create('crawl theme data').unique({ name: 'crawl theme data' });
    crawlThemeData.schedule();
    await agendaInstance.start();
    await crawlThemeData
      .repeatEvery('30 23 * * *', {
        timezone: 'Australia/Sydney',
      })
      .save();
  })();
}

export default agendaJob;
