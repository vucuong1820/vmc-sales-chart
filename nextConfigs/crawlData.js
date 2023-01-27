/* eslint-disable no-console */
/* eslint-disable no-useless-escape */

const Customers = require('../models/Customers');
const CronJobs = require('../models/CronJobs');
const { default: axios } = require('axios');
const cheerio = require('cheerio');
const dbConnect = require('../configs/dbConnect');
const { startOfDay, endOfDay, addDays } = require('date-fns');
const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');
const themeShop = require('./themeShop.js');
const TIME_ZONE = 'Australia/Sydney';

dbConnect();

const getPreviousData = async (dayStart, name) => {
  const data = await Customers.findOne(
    {
      createdAt: {
        $lt: dayStart,
      },
      name,
    },
    {},
    { sort: { createdAt: -1 } },
  );
  return data;
};

const saveCronJob = async () => {
  const currentDate = new Date();
  await CronJobs.findOneAndUpdate(
    {},
    {
      lastRunAt: currentDate.toISOString(),
      nextRunAt: addDays(currentDate, 1).toISOString(),
    },
    { upsert: true },
  );
};

const crawlData = async () => {
  try {
    themeShop.forEach(async (theme) => {
      let presentSales;
      let review;
      let reviewQuantity;
      const { url, themeId, fixedReviews, fixedSales, name } = theme;
      await axios.get(`${url}/reviews/${themeId}`).then((res) => {
        const $ = cheerio.load(res.data);
        presentSales = $('.item-header__sales-count').text();
        review = $('.is-visually-hidden').text();
        reviewQuantity = $('.t-body.-size-l.h-m0').text();
      });
      const currentDate = new Date();
      const dayStart = zonedTimeToUtc(startOfDay(utcToZonedTime(currentDate, TIME_ZONE)), TIME_ZONE).toISOString();
      const dayEnd = zonedTimeToUtc(endOfDay(utcToZonedTime(currentDate, TIME_ZONE)), TIME_ZONE).toISOString();
      const previousData = await getPreviousData(dayStart, name);
      await Customers.findOneAndUpdate(
        {
          createdAt: {
            $gte: dayStart,
            $lte: dayEnd,
          },
          themeId: themeId,
          name: name,
        },
        {
          quantity: Number(presentSales.replace(/\D/g, '')) - fixedSales,
          sales: Number(presentSales.replace(/\D/g, '')) - fixedSales - (previousData?.quantity ?? 0),
          review: Number(parseFloat(review.match(/[\d\.]+/))),
          reviewQuantity: Number(reviewQuantity.replace(/\D/g, '')) - fixedReviews,
          reviewsPerDay: Number(reviewQuantity.replace(/\D/g, '')) - fixedReviews - (previousData?.reviewQuantity ?? 0),
        },
        { upsert: true },
      );
    });
    await saveCronJob();
  } catch (error) {
    console.log(error);
  }
};

module.exports = crawlData;
