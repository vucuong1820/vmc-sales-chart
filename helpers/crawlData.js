/* eslint-disable no-useless-escape */
import { themeShop } from '@constants/themeShop';
import Customers from '@models/Customers';
import axios from 'axios';
import cheerio from 'cheerio';
import dbConnect from 'configs/dbConnect';
import formatDate from './formatDate';

dbConnect();

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
        const currentDate = new Date();
        const yesterday = currentDate;

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
      const currentDate = new Date();
      await Customers.findOneAndUpdate(
        {
          createdAt: {
            $gte: formatDate(currentDate).startingDate.toISOString(),
            $lte: formatDate(currentDate).endingDate.toISOString(),
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
