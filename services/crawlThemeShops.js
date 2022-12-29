import { themeShop } from '@constants/themeShop';
import axios from 'axios';

export default async function crawlThemeShops() {
  themeShop.forEach(async (item) => {
    await axios.get(`/api/crawl?theme=${item.name}`);
  });
}
