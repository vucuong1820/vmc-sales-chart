import dbConnect from "../../../utils/dbConnect";
import puppeteer from "puppeteer";
import chromium from 'chrome-aws-lambda';
import Customers from "../../../models/Customers";
import format from "date-fns/format";
import { themeShop } from "../../../constants/themeShop";
import { getDateChart } from "../../../helpers/utils";
dbConnect();

export default async function handler(req, res) {
  for (let i = 0; i < themeShop.length; i++) {
    const crawlData = async () => {
      // const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
      const browser = await chromium.puppeteer.launch({
        executablePath: await chromium.executablePath,
        args: chromium.args,
        headless: chromium.headless
      });
      const page = await browser.newPage();
      await page.goto(themeShop[i].url);
      const presentSales = await page.evaluate(() => {
        let titleLinks = document.querySelector(".item-header__sales-count");
        return titleLinks.innerText;
      });
      const review = await page.evaluate(() => {
        let review = document.querySelector(".is-visually-hidden");
        return review.innerText;
      });

      await browser.close();
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
      const filterData = previousDate.filter(
        (item) => item.name === themeShop[i].name
      );
      if (previousDate.length === 0) {
        await Customers.findOneAndUpdate(
          {
            created_at: format(yesterday, "MM/dd/yyyy"),
            themeId: themeShop[i].themeId,
            name: themeShop[i].name,
          },
          {
            quantity:
              Number(presentSales.replace(/\D/g, "")) - themeShop[i].fixedSales,
            sales:
              Number(presentSales.replace(/\D/g, "")) - themeShop[i].fixedSales,
            review: Number(review.replace(/[^0-9\.]+/g, "")),
          },
          { upsert: true }
        );
      } else {
        await Customers.findOneAndUpdate(
          {
            created_at: format(new Date(), "MM/dd/yyyy"),
            themeId: themeShop[i].themeId,
            name: themeShop[i].name,
          },
          {
            quantity:
              Number(presentSales.replace(/\D/g, "")) - themeShop[i].fixedSales,
            sales:
              Number(presentSales.replace(/\D/g, "")) -
              themeShop[i].fixedSales -
              filterData[0].quantity,
            review: Number(review.replace(/[^0-9\.]+/g, "")),
          },
          { upsert: true }
        );
      }
    };
    await crawlData();
  }

  const getData = async () => {
    let time = getDateChart("this_week");
    await Customers.find({
      created_at: {
        $gte: time.start,
        $lte: time.end,
      },
    })
      .exec()
      .then((data) => res.json(data));
  };
  await getData();
}
