import { crawlData } from '@helpers/crawlData';

export default async function handler() {
  await crawlData();
}
