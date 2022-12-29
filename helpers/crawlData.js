/* eslint-disable no-useless-escape */
import dbConnect from '@utils/dbConnect';
import Customers from '@models/Customers';
import format from 'date-fns/format';
import cheerio from 'cheerio';
import axios from 'axios';
import { themeShop } from '@constants/themeShop';
import { utcToZonedTime } from 'date-fns-tz';

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
        reviewQuantity = $('t-body -size-l h-m0').text();
      });
      const getPreviousData = async () => {
        const currentDate = utcToZonedTime(new Date(), 'Australia/Sydney');
        const yesterday = new Date(currentDate);

        yesterday.setDate(yesterday.getDate() - 1);
        const data = await Customers.find({
          created_at: format(yesterday, 'MM/dd/yyyy'),
        });
        return data;
      };

      const previousDate = await getPreviousData();
      const filterData = previousDate.filter((item) => item.name === name);
      const currentDate = utcToZonedTime(new Date(), 'Australia/Sydney');
      await Customers.findOneAndUpdate(
        {
          created_at: format(currentDate, 'MM/dd/yyyy'),
          themeId: themeId,
          name: name,
        },
        {
          quantity: Number(presentSales.replace(/\D/g, '')) - fixedSales,
          sales: Number(presentSales.replace(/\D/g, '')) - fixedSales - filterData[0].quantity,
          review: Number(parseFloat(review.match(/[\d\.]+/))),
          updatedAt: currentDate,
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
