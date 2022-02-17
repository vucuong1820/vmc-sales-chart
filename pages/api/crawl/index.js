import dbConnect from "../../../utils/dbConnect";
import Customers from "../../../models/Customers";
import format from "date-fns/format";
import {
  getDateChart,
} from "../../../helpers/utils";
import * as cheerio from "cheerio";
import axios from "axios";
import { themeShop } from "../../../constants/themeShop";
import { utcToZonedTime } from "date-fns-tz";
dbConnect();

export default async function handler(req, res) {
  const { shop } = req.query;
  const crawlData = async () => {
    try {
      const getFilterShop = () => {
        return themeShop.filter((item) => item.name === shop);
      };
      const filterShop = getFilterShop();
      const { fixedSales, name, themeId, url } = filterShop[0];
      let presentSales;
      let review;
      await axios.get(url).then((res) => {
        const $ = cheerio.load(res.data);
        presentSales = $(".item-header__sales-count").text();
        review = $(".is-visually-hidden").text();
      });

      const getPreviousData = async () => {
        const today = new Date();
        const yesterday = new Date(today);

        yesterday.setDate(yesterday.getDate() - 1);
        const data = await Customers.find({
          created_at: format(yesterday, "MM/dd/yyyy"),
        });
        return data;
      };
      const previousDate = await getPreviousData();
      const filterData = previousDate.filter((item) => item.name === name);
      
      const currentDate = utcToZonedTime(new Date(), "Asia/Jakarta");
      await Customers.findOneAndUpdate(
        {
          created_at: format(new Date() , "MM/dd/yyyy"),
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
    } catch (error) {
      console.log(error);
    }
  };
  await crawlData();

  const getData = async () => {
    let time = getDateChart("this_week");
    await Customers.find({
      created_at: {
        $gte: time.start,
        $lte: time.end,
      },
    })
      .exec()
      .then((data) => {
        const filterData = data.filter((item) => item.name === shop);
        res.json(filterData);
      });
  };
  await getData();
}
