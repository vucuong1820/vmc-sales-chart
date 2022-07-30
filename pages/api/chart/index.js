import dbConnect from "../../../utils/dbConnect";
import Customers from "../../../models/Customers";
import axios from "axios";
import * as cheerio from "cheerio";
import { themeShop } from "../../../constants/themeShop";

dbConnect();

export default async function handler(req, res) {
  const { startingDay, endingDay, themeId } = req.query;
  let presentSales
  let filters = {
    created_at: {
      $gte: startingDay,
      $lte: endingDay,
    }
  }

  if (themeId) {
    filters['themeId'] = themeId
    const theme = themeShop.find(theme => theme.themeId === Number(themeId))
    if (theme) {
      await axios.get(theme.url).then((res) => {
        const $ = cheerio.load(res.data);
        presentSales = $(".item-header__sales-count").text();
        presentSales = Number(presentSales.replace(/\D/g, ""))
      });
    }
  }

  await Customers.find(filters)
    .exec()
    .then((data) => res.json({items: data, totalSales: presentSales}));
}
