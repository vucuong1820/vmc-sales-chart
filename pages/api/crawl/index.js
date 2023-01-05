/* eslint-disable no-useless-escape */
import { themeShop } from '@constants/themeShop';
import formatDate from '@helpers/formatDate';
import { getDateRange } from '@helpers/utils';
import Customers from '@models/Customers';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { utcToZonedTime } from 'date-fns-tz';

export default async function handler(req, res) {
  const { theme } = req.query;
  await crawlData(theme);

  const time = getDateRange('this_week');
  const response = await Customers.find({
    createdAt: {
      $gte: time.start,
      $lte: time.end,
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
    // const currentDate = utcToZonedTime(new Date(), 'Australia/Sydney');
    let currentDate = new Date();
    let yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    currentDate = currentDate.toISOString();
    if (filterData.length === 0) {
      await Customers.findOneAndUpdate(
        {
          createdAt: {
            $gte: formatDate(yesterday).startingDate,
            $lte: formatDate(yesterday).endingDate,
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
            $gte: formatDate(currentDate).startingDate,
            $lte: formatDate(currentDate).endingDate,
          },
          // created_at: format(currentDate, 'MM/dd/yyyy'),
          themeId,
          name,
        },
        {
          quantity: Number(presentSales.replace(/\D/g, '')) - fixedSales,
          sales: Number(presentSales.replace(/\D/g, '')) - fixedSales - filterData[0].quantity,
          review: Number(parseFloat(review.match(/[\d\.]+/))),
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
      $gte: formatDate(yesterday).startingDate,
      $lte: formatDate(yesterday).endingDate,
    },
    // created_at: format(yesterday, 'MM/dd/yyyy'),
  });
  return data;
};

// const createOrUpdateThemeData = async ({ filters, payload }) => {
//   let themeData = await Customers.findOne({ ...filters });
//   if (themeData) {
//     for (const key in payload) {
//       const value = payload[key];
//       themeData[key] = value;
//     }
//   } else {
//     themeData = new Customers({
//       ...filters,
//       ...payload,
//     });
//   }
// };
