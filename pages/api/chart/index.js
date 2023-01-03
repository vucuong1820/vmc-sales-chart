import { themeShop } from '@constants/themeShop';
import dbConnect from '@helpers/dbConnect';
import Customers from '@models/Customers';
import axios from 'axios';
import * as cheerio from 'cheerio';

dbConnect();

export default async function handler(req, res) {
  const { startingDay, endingDay, themeId } = req.query;
  // await migrateTimestamp();
  let presentSales;
  let reviewQuantity;
  const startingDate = new Date(startingDay);
  startingDate.setUTCHours(0);
  startingDate.setUTCMinutes(0);
  startingDate.setUTCSeconds(0);
  const endingDate = new Date(endingDay);
  endingDate.setUTCHours(23);
  endingDate.setUTCMinutes(59);
  endingDate.setUTCSeconds(59);

  const filters = {
    createdAt: {
      $gte: startingDate,
      $lte: endingDate,
    },
  };

  if (themeId) {
    filters.themeId = themeId;
    const theme = themeShop.find((theme) => theme.themeId === Number(themeId));
    if (theme) {
      const { url, themeId } = theme;
      await axios.get(`${url}/reviews/${themeId}`).then((res) => {
        const $ = cheerio.load(res.data);
        presentSales = $('.item-header__sales-count').text();
        presentSales = Number(presentSales.replace(/\D/g, ''));
        reviewQuantity = Number($('.t-body.-size-l.h-m0').text().replace(/\D/g, ''));
      });
    }
  }

  const response = await Customers.find(filters);
  res.json({
    items: response,
    totalSales: presentSales,
    reviewQuantity,
  });
}
