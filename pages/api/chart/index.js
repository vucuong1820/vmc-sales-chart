import dbConnect from '@utils/dbConnect';
import Customers from '@models/Customers';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { themeShop } from '@constants/themeShop';

dbConnect();

export default async function handler(req, res) {
  const { startingDay, endingDay, themeId } = req.query;
  let presentSales;
  let reviewQuantity;
  const filters = {
    created_at: {
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
