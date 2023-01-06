import { themeShop } from '@constants/themeShop';
import migrateTimestamp from '@helpers/migrateTimestamp';
import Customers from '@models/Customers';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dbConnect from 'configs/dbConnect';

dbConnect();

export default async function handler(req, res) {
  const { startingDay, endingDay, themeId } = req.query;

  // await migrateTimestamp();
  let presentSales;
  let reviewQuantity;

  const filters = {
    createdAt: {
      $gte: startingDay,
      $lte: endingDay,
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
