/* eslint-disable no-console */
/* eslint-disable no-useless-escape */
import { TIME_ZONE } from '@constants';
import { themeShop } from '@constants/themeShop';
import Customers from '@models/Customers';
import axios from 'axios';
import cheerio from 'cheerio';
import dbConnect from 'configs/dbConnect';
import { endOfDay, startOfDay } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

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

export const crawlData = async () => {
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
      console.log('[CRAWL]:', name);
    });
  } catch (error) {
    console.log(error);
  }
};
