/* eslint-disable no-useless-escape */
import { crawlData } from '@helpers/crawlData';
import dbConnect from 'configs/dbConnect';

dbConnect();

export default async function handler(req, res) {
  await crawlData();
  res.json();
}
