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

const getPreviousData = async () => {
  const currentDate = new Date();
  const yesterday = currentDate;

  yesterday.setDate(yesterday.getDate() - 1);
  const data = await Customers.find({
    createdAt: {
      $gte: zonedTimeToUtc(startOfDay(utcToZonedTime(yesterday, TIME_ZONE)), TIME_ZONE),
      $lte: zonedTimeToUtc(endOfDay(utcToZonedTime(yesterday, TIME_ZONE)), TIME_ZONE),
    },
  });
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

      const previousDate = await getPreviousData();
      const filterData = previousDate.filter((item) => item.name === name);
      console.log(filterData?.[0]?.quantity);
      const currentDate = new Date();
      // console.log({
      //   $gte: zonedTimeToUtc(startOfDay(utcToZonedTime(currentDate, TIME_ZONE)), TIME_ZONE).toISOString(),
      //   $lte: zonedTimeToUtc(endOfDay(utcToZonedTime(currentDate, TIME_ZONE)), TIME_ZONE).toISOString(),
      // });
      await Customers.findOneAndUpdate(
        {
          createdAt: {
            $gte: zonedTimeToUtc(startOfDay(utcToZonedTime(currentDate, TIME_ZONE)), TIME_ZONE).toISOString(),
            $lte: zonedTimeToUtc(endOfDay(utcToZonedTime(currentDate, TIME_ZONE)), TIME_ZONE).toISOString(),
          },
          themeId: themeId,
          name: name,
        },
        {
          quantity: Number(presentSales.replace(/\D/g, '')) - fixedSales,
          sales: Number(presentSales.replace(/\D/g, '')) - fixedSales - (filterData?.[0]?.quantity ?? 0),
          review: Number(parseFloat(review.match(/[\d\.]+/))),
          reviewQuantity: Number(reviewQuantity.replace(/\D/g, '')) - fixedReviews,
        },
        { upsert: true },
      );
    });
  } catch (error) {
    console.log(error);
  }
};
