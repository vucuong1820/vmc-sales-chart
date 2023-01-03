import crawlJob from '@helpers/autoCrawlData';

export default async function handler(req, res) {
  crawlJob.start();
  res.json();
}
