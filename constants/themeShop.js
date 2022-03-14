import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
const currentDate = utcToZonedTime(new Date(), "Australia/Sydney");
export const themeShop = [
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
];
