import dbConnect from "../../../utils/dbConnect";
import Customers from "../../../models/Customers";
import format from "date-fns/format";
import { getDateRange } from "../../../helpers/utils";
import * as cheerio from "cheerio";
import axios from "axios";
import { themeShop } from "../../../constants/themeShop";
import { utcToZonedTime } from "date-fns-tz";
dbConnect();

export default async function handler(req, res) {
  const { theme } = req.query;
  const crawlData = async () => {
    try {
      console.log(theme, 'theme');
      const currentTheme = themeShop.find((item) => item.name === theme);
      console.log(currentTheme, '==============> currentTheme')
      const { fixedSales, name, themeId, url } = currentTheme;
      let presentSales;
      let review;
      await axios.get(url).then((res) => {
        const $ = cheerio.load(res.data);
        presentSales = $(".item-header__sales-count").text();
        review = $(".is-visually-hidden").text();
      });

      const getPreviousData = async () => {
        const currentDate = utcToZonedTime(new Date(), "Australia/Sydney");
        const yesterday = new Date(currentDate);

        yesterday.setDate(yesterday.getDate() - 1);
        const data = await Customers.find({
          created_at: format(yesterday, "MM/dd/yyyy"),
        });
        return data;
      };

      const previousDate = await getPreviousData();

      const filterData = previousDate.filter((item) => item.name === name);
      const currentDate = utcToZonedTime(new Date(), "Australia/Sydney");
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      if (filterData.length === 0) {
        await Customers.findOneAndUpdate(
          {
            created_at: format(yesterday, "MM/dd/yyyy"),
            themeId: themeId,
            name: name,
          },
          {
            quantity: Number(presentSales.replace(/\D/g, "")) - fixedSales,
            sales: Number(presentSales.replace(/\D/g, "")) - fixedSales,
            review: Number(parseFloat(review.match(/[\d\.]+/))),
          },
          { upsert: true }
        );
      } else {
        await Customers.findOneAndUpdate(
          {
            created_at: format(currentDate, "MM/dd/yyyy"),
            themeId: themeId,
            name: name,
          },
          {
            quantity: Number(presentSales.replace(/\D/g, "")) - fixedSales,
            sales:
              Number(presentSales.replace(/\D/g, "")) -
              fixedSales -
              filterData[0].quantity,
            review: Number(parseFloat(review.match(/[\d\.]+/))),
            updatedAt3: currentDate,
          },
          { upsert: true }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  await crawlData();

  const getData = async () => {
    let time = getDateRange("this_week");
    await Customers.find({
      created_at: {
        $gte: format(time.start, 'MM/dd/yyyy'),
        $lte: format(time.end, 'MM/dd/yyyy')
      },
    })
      .exec()
      .then((data) => {
        const filterData = data.filter((item) => item.name === theme);
        res.json(filterData);
      });
  };
  await getData();
}
