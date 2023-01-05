/* eslint-disable no-useless-escape */
import { themeShop } from '@constants/themeShop';
import Customers from '@models/Customers';
import axios from 'axios';
import cheerio from 'cheerio';
import { utcToZonedTime } from 'date-fns-tz';
import formatDate from './formatDate';

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
      const getPreviousData = async () => {
        const currentDate = utcToZonedTime(new Date(), 'Australia/Sydney');
        const yesterday = new Date(currentDate);

        yesterday.setDate(yesterday.getDate() - 1);
        const data = await Customers.find({
          createdAt: {
            $gte: formatDate(yesterday).startingDate,
            $lte: formatDate(yesterday).endingDate,
          },
        });
        return data;
      };

      const previousDate = await getPreviousData();
      const filterData = previousDate.filter((item) => item.name === name);
      const currentDate = utcToZonedTime(new Date(), 'Australia/Sydney');
      await Customers.findOneAndUpdate(
        {
          createdAt: {
            $gte: formatDate(currentDate).startingDate,
            $lte: formatDate(currentDate).endingDate,
          },
          // created_at: format(currentDate, 'MM/dd/yyyy'),
          themeId: themeId,
          name: name,
        },
        {
          quantity: Number(presentSales.replace(/\D/g, '')) - fixedSales,
          sales: Number(presentSales.replace(/\D/g, '')) - fixedSales - filterData[0].quantity,
          review: Number(parseFloat(review.match(/[\d\.]+/))),
          reviewQuantity: Number(reviewQuantity.replace(/\D/g, '')) - fixedReviews,
        },
        { upsert: true },
      );
      // }
    });
  } catch (error) {
    // console.log(error);
  }
};
