import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
const currentDate = utcToZonedTime(new Date(), "Australia/Sydney");
export const shopifyThemes = [
  {
    url: "https://themeforest.net/item/minimog-the-high-converting-shopify-theme/33380968",
    themeId: 33380968,
    name: "Minimog",
    fixedSales: 2608,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/avone-multipurpose-shopify-theme/24276567",
    themeId: 24276567,
    name: "Avone",
    fixedSales: 6351,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/ella-responsive-shopify-template/9691007",
    themeId: 9691007,
    name: "Ella",
    fixedSales: 24085,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/wokiee-multipurpose-shopify-theme/22559417",
    themeId: 22559417,
    name: "Wokiee",
    fixedSales: 19245,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/kalles-clean-versatile-shopify-theme/26320622",
    themeId: 26320622,
    name: "Kalles",
    fixedSales: 7416,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/shella-ultimate-fashion-responsive-shopify-theme/22804833",
    themeId: 22804833,
    name: "Shella",
    fixedSales: 9618,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/gecko-responsive-shopify-theme/21398578",
    themeId: 21398578,
    name: "Gecko",
    fixedSales: 6666,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/unsen-multipurpose-shopify-theme-os20/39744835",
    themeId: 39744835,
    name: "Unsen",
    fixedSales: 114,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
];

export const wpThemes = [
  {
    url: "https://themeforest.net/item/minimog-the-high-converting-ecommerce-wordpress-theme/36947163",
    themeId: 36947163,
    name: "MinimogWP",
    fixedSales: 2302,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/flatsome-multipurpose-responsive-woocommerce-theme/5484319",
    themeId: 5484319,
    name: "Flatsome",
    fixedSales: 207982,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/woodmart-woocommerce-wordpress-theme/20264492",
    themeId: 20264492,
    name: "WoodMart",
    fixedSales: 52743,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/porto-responsive-wordpress-ecommerce-theme/9207399",
    themeId: 9207399,
    name: "Porto",
    fixedSales: 79056,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/xstore-responsive-woocommerce-theme/15780546",
    themeId: 15780546,
    name: "XStore",
    fixedSales: 34868,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/kalles-versatile-woocommerce-theme/34529223",
    themeId: 34529223,
    name: "Kalles",
    fixedSales: 1015,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/electro-electronics-store-woocommerce-theme/15720624",
    themeId: 15720624,
    name: "Electro",
    fixedSales: 22229,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/rey-multipurpose-woocommerce-theme/24689383",
    themeId: 24689383,
    name: "Rey",
    fixedSales: 6007,
    created_at: format(currentDate, "MM/dd/yyyy"),
  },
  {
    url: "https://themeforest.net/item/savoy-minimalist-ajax-woocommerce-theme/12537825",
    themeId: 12537825,
    name: "Savoy",
    fixedSales: 13667,
    created_at: format(currentDate, "MM/dd/yyyy"),
  }
];

export const themeShop = process.env.NEXT_PUBLIC_PRODUCT === 'minimogwp' ? wpThemes : shopifyThemes;
