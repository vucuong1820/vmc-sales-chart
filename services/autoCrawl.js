import { themeShop } from '@constants/themeShop';
import axios from 'axios';

export default async function autoCrawl() {
  themeShop.forEach(async () => {
    await axios.get(`/api/auto-crawling`);
  });
}
