import { TIME_ZONE } from '@constants';
import { JOB_EXPRESSION, JOB_NAME } from '@constants/agenda';
import Agenda from 'agenda';
import { crawlData } from './crawlData';

/* eslint-disable no-console */
const agendaInstance = new Agenda({
  db: { address: process.env.MONGO_URI, collection: 'agenda-jobs' },
});

async function agendaJob() {
  agendaInstance.define(JOB_NAME, async (job, done) => {
    console.log('=======================');
    console.log('[AGENDA]: AUTO CRAWL THEME DATA');
    await crawlData();
  });

  (async function () {
    const crawlThemeData = agendaInstance.create(JOB_NAME).unique({ name: JOB_NAME });
    crawlThemeData.schedule();
    await agendaInstance.start();
    await crawlThemeData
      .repeatEvery(JOB_EXPRESSION, {
        timezone: TIME_ZONE,
      })
      .save();
  })();
}

export default agendaJob;
