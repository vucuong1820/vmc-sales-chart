/* eslint-disable no-useless-escape */
const Customers = require('../models/Customers');
const axios = require('axios');
const cheerio = require('cheerio');
const { utcToZonedTime } = require('date-fns-tz');
const { format } = require('date-fns');

const currentDate = utcToZonedTime(new Date(), 'Australia/Sydney');
const shopifyThemes = [
  {
    url: 'https://themeforest.net/item/minimog-the-high-converting-shopify-theme',
    themeId: 33380968,
    name: 'Minimog',
    fixedSales: 2608,
    fixedReviews: 322,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#ED2B33FF',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/avone-multipurpose-shopify-theme',
    themeId: 24276567,
    name: 'Avone',
    fixedSales: 6351,
    fixedReviews: 421,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#A01855FF',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/ella-responsive-shopify-template',
    themeId: 9691007,
    name: 'Ella',
    fixedSales: 24085,
    fixedReviews: 819,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#2C5F2D',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/wokiee-multipurpose-shopify-theme',
    themeId: 22559417,
    name: 'Wokiee',
    fixedSales: 19245,
    fixedReviews: 449,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#5B84B1FF',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/kalles-clean-versatile-shopify-theme',
    themeId: 26320622,
    name: 'Kalles',
    fixedSales: 7416,
    fixedReviews: 1096,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#5F4B8BFF',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/shella-ultimate-fashion-responsive-shopify-theme',
    themeId: 22804833,
    name: 'Shella',
    fixedSales: 9618,
    fixedReviews: 223,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#A07855FF',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/gecko-responsive-shopify-theme',
    themeId: 21398578,
    name: 'Gecko',
    fixedSales: 6666,
    fixedReviews: 704,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#101820FF',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/unsen-multipurpose-shopify-theme-os20',
    themeId: 39744835,
    name: 'Unsen',
    fixedSales: 114,
    fixedReviews: 60,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#15C39A',
    tension: 0.3,
  },
];

const wpThemes = [
  {
    url: 'https://themeforest.net/item/minimog-the-high-converting-ecommerce-wordpress-theme',
    themeId: 36947163,
    name: 'MinimogWP',
    fixedSales: 2302,
    fixedReviews: 91,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#ED2B33FF',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/flatsome-multipurpose-responsive-woocommerce-theme',
    themeId: 5484319,
    name: 'Flatsome',
    fixedSales: 207982,
    fixedReviews: 7162,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#A01855FF',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/woodmart-woocommerce-wordpress-theme',
    themeId: 20264492,
    name: 'WoodMart',
    fixedSales: 52743,
    fixedReviews: 2137,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#2C5F2D',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/porto-responsive-wordpress-ecommerce-theme',
    themeId: 9207399,
    name: 'Porto',
    fixedSales: 79056,
    fixedReviews: 3505,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#5B84B1FF',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/xstore-responsive-woocommerce-theme',
    themeId: 15780546,
    name: 'XStore',
    fixedSales: 34868,
    fixedReviews: 1496,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#5F4B8BFF',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/kalles-versatile-woocommerce-theme',
    themeId: 34529223,
    name: 'Kalles',
    fixedSales: 1015,
    fixedReviews: 114,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#00EE00',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/electro-electronics-store-woocommerce-theme',
    themeId: 15720624,
    name: 'Electro',
    fixedSales: 22229,
    fixedReviews: 911,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#FFFF00',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/rey-multipurpose-woocommerce-theme',
    themeId: 24689383,
    name: 'Rey',
    fixedSales: 6007,
    fixedReviews: 369,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#FFCCFF',
    tension: 0.3,
  },
  {
    url: 'https://themeforest.net/item/savoy-minimalist-ajax-woocommerce-theme',
    themeId: 12537825,
    name: 'Savoy',
    fixedSales: 13667,
    fixedReviews: 520,
    createdAt: currentDate,
    created_at: format(currentDate, 'MM/dd/yyyy'),
    fill: false,
    color: '#006699',
    tension: 0.3,
  },
];

const themeShop = process.env.NEXT_PUBLIC_PRODUCT === 'minimogwp' ? wpThemes : shopifyThemes;

function formatDate(input) {
  if (!input) return;
  const startingDate = new Date(input);
  startingDate.setHours(0);
  startingDate.setMinutes(0);
  startingDate.setSeconds(0);
  startingDate.setMilliseconds(0);
  const endingDate = new Date(input);
  endingDate.setHours(23);
  endingDate.setMinutes(59);
  endingDate.setSeconds(59);
  endingDate.setMilliseconds(999);

  return {
    startingDate,
    endingDate,
  };
}

const crawlData = async () => {
  // eslint-disable-next-line no-console
  console.log(`STARTING AUTO CRAWL at ${new Date().toISOString}`);
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
            $gte: formatDate(yesterday).startingDate.toISOString(),
            $lte: formatDate(yesterday).endingDate.toISOString(),
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

module.exports = crawlData;
