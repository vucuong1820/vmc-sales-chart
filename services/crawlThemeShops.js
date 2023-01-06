import axios from 'axios';

export default async function crawlThemeShops() {
  await axios.get(`/api/manual-crawling`);
}
