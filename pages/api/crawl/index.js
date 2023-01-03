/* eslint-disable no-useless-escape */
import { themeShop } from '@constants/themeShop';
import dbConnect from '@helpers/dbConnect';
import { getDateRange } from '@helpers/utils';
import Customers from '@models/Customers';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { endOfDay, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

dbConnect();

export default async function handler(req, res) {
  const { theme } = req.query;
  await crawlData(theme);

  const time = getDateRange('this_week');
  const response = await Customers.find({
    createdAt: {
      $gte: startOfDay(new Date(time.start)),
      $lte: endOfDay(new Date(time.end)),
    },
  });

  const filterData = response.filter((item) => item.name === theme);
  res.json(filterData);
}

const crawlData = async (theme) => {
  try {
    const currentTheme = themeShop.find((item) => item.name === theme);
    const { fixedReviews, fixedSales, name, themeId, url } = currentTheme;
    let presentSales;
    let review;
    let reviewQuantity;
    await axios.get(`${url}/reviews/${themeId}`).then((res) => {
      const $ = cheerio.load(res.data);
      presentSales = $('.item-header__sales-count').text();
      review = $('.is-visually-hidden').text();
      reviewQuantity = $('.t-body.-size-l.h-m0').text();
    });
    const previousDate = await getPreviousData();

    const filterData = previousDate.filter((item) => item.name === name);
    const currentDate = utcToZonedTime(new Date(), 'Australia/Sydney');
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    if (filterData.length === 0) {
      await Customers.findOneAndUpdate(
        {
          createdAt: {
            $gte: startOfDay(yesterday),
            $lte: endOfDay(yesterday),
          },
          // created_at: format(yesterday, 'MM/dd/yyyy'),
          themeId,
          name,
        },
        {
          quantity: Number(presentSales.replace(/\D/g, '')) - fixedSales,
          sales: Number(presentSales.replace(/\D/g, '')) - fixedSales,
          review: Number(parseFloat(review.match(/[\d\.]+/))),
          reviewQuantity: Number(reviewQuantity.replace(/\D/g, '')) - fixedReviews,
        },
        { upsert: true },
      );
    } else {
      await Customers.findOneAndUpdate(
        {
          createdAt: {
            $gte: startOfDay(currentDate),
            $lte: endOfDay(currentDate),
          },
          // created_at: format(currentDate, 'MM/dd/yyyy'),
          themeId,
          name,
        },
        {
          quantity: Number(presentSales.replace(/\D/g, '')) - fixedSales,
          sales: Number(presentSales.replace(/\D/g, '')) - fixedSales - filterData[0].quantity,
          review: Number(parseFloat(review.match(/[\d\.]+/))),
          updatedAt: currentDate,
          reviewQuantity: Number(reviewQuantity.replace(/\D/g, '')) - fixedReviews,
          reviewsPerDay: Number(reviewQuantity.replace(/\D/g, '')) - fixedReviews - (filterData?.[0]?.reviewQuantity ?? 0),
        },
        { upsert: true },
      );
    }
  } catch (error) {
    // console.log(error);
  }
};

const getPreviousData = async () => {
  const currentDate = utcToZonedTime(new Date(), 'Australia/Sydney');
  const yesterday = new Date(currentDate);

  yesterday.setDate(yesterday.getDate() - 1);
  const data = await Customers.find({
    createdAt: {
      $gte: startOfDay(yesterday),
      $lte: endOfDay(yesterday),
    },
    // created_at: format(yesterday, 'MM/dd/yyyy'),
  });
  return data;
};
