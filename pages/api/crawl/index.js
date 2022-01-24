import dbConnect from "../../../utils/dbConnect";
import puppeteer from "puppeteer";
import Customers from "../../../models/Customers";
import format from "date-fns/format";
import { themeShop } from "../../../constants/themeShop";

dbConnect();

export default async function handler(req, res) {
  themeShop.forEach(async (item) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(item.url);
    const presentSales = await page.evaluate(() => {
      let titleLinks = document.querySelector(".item-header__sales-count");
      return titleLinks.innerText;
    });
    await Customers.findOneAndUpdate(
      {
        created_at: format(new Date(), "MM/dd/yyyy"),
        themeId: item.themeId,
        name: item.name,
      },
      {
        quantity: Number(presentSales.replace(/\D/g, "")) - item.fixedSales,
      },
      { upsert: true }
    );
    await browser.close();
  });

  const data = await Customers.find({
    createdAt: format(new Date(), "MM/dd/yyyy"),
  }).exec();
  res.json(data);
}
