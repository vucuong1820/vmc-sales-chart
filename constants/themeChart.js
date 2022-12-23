const shopifyChart = [
  {
    label: "Minimog",
    fill: false,
    borderColor: "#ED2B33FF",
    tension: 0.3,
    url: "https://themeforest.net/item/minimog-the-high-converting-shopify-theme/33380968",
  },
  {
    label: "Avone",
    fill: false,
    borderColor: "#A01855FF",
    tension: 0.3,
    url: "https://themeforest.net/item/avone-multipurpose-shopify-theme/24276567",
  },
  {
    label: "Ella",
    fill: false,
    borderColor: "#2C5F2D",
    tension: 0.3,
    url: "https://themeforest.net/item/ella-responsive-shopify-template/9691007",
  },
  {
    label: "Wokiee",
    fill: false,
    borderColor: "#5B84B1FF",
    tension: 0.3,
    url: "https://themeforest.net/item/wokiee-multipurpose-shopify-theme/22559417",
  },
  {
    label: "Kalles",
    fill: false,
    borderColor: "#5F4B8BFF",
    tension: 0.3,
    url: "https://themeforest.net/item/kalles-clean-versatile-shopify-theme/26320622",
  },
  {
    label: "Shella",
    fill: false,
    borderColor: "#A07855FF",
    tension: 0.3,
    url: "https://themeforest.net/item/shella-ultimate-fashion-responsive-shopify-theme/22804833",
  },
  {
    label: "Gecko",
    fill: false,
    borderColor: "#101820FF",
    tension: 0.3,
    url: "https://themeforest.net/item/gecko-responsive-shopify-theme/21398578",
  },
  {
    label: "Unsen",
    fill: false,
    borderColor: "#15C39A",
    tension: 0.3,
    url: "https://themeforest.net/item/unsen-multipurpose-shopify-theme-os20/39744835",
  },
];

const wpChart = [
  {
    label: "MinimogWP",
    fill: false,
    borderColor: "#ED2B33FF",
    tension: 0.3,
    url: "https://themeforest.net/item/minimog-the-high-converting-ecommerce-wordpress-theme/36947163",
  },
  {
    label: "Flatsome",
    fill: false,
    borderColor: "#A01855FF",
    tension: 0.3,
    url: "https://themeforest.net/item/flatsome-multipurpose-responsive-woocommerce-theme/5484319",
  },
  {
    label: "WoodMart",
    fill: false,
    borderColor: "#2C5F2D",
    tension: 0.3,
    url: "https://themeforest.net/item/woodmart-woocommerce-wordpress-theme/20264492",
  },
  {
    label: "Porto",
    fill: false,
    borderColor: "#5B84B1FF",
    tension: 0.3,
    url: "https://themeforest.net/item/porto-responsive-wordpress-ecommerce-theme/9207399",
  },
  {
    label: "XStore",
    fill: false,
    borderColor: "#5F4B8BFF",
    tension: 0.3,
    url: "https://themeforest.net/item/xstore-responsive-woocommerce-theme/15780546",
  },
  {
    label: "Kalles",
    fill: false,
    borderColor: "#00EE00",
    tension: 0.3,
    url: "https://themeforest.net/item/kalles-versatile-woocommerce-theme/34529223",
  },
  {
    label: "Electro",
    fill: false,
    borderColor: "#FFFF00",
    tension: 0.3,
    url: "https://themeforest.net/item/electro-electronics-store-woocommerce-theme/15720624",
  },
  {
    label: "Rey",
    fill: false,
    borderColor: "#FFCCFF",
    tension: 0.3,
    url: "https://themeforest.net/item/rey-multipurpose-woocommerce-theme/24689383",
  },
  {
    label: "Savoy",
    fill: false,
    borderColor: "#006699",
    tension: 0.3,
    url: "https://themeforest.net/item/savoy-minimalist-ajax-woocommerce-theme/12537825",
  }
];

export const themeChart = process.env.NEXT_PUBLIC_PRODUCT === 'minimogwp' ? wpChart : shopifyChart;
