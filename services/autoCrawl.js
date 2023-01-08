import axios from 'axios';

export default async function autoCrawl() {
  await axios.get(`/api/auto-crawling`);
}
