/* eslint-disable no-console */
import Customers from '@models/Customers';
import dbConnect from 'configs/dbConnect';

dbConnect();
export default async function migrateTimestamp() {
  const data = await Customers.find();
  for (const item of data) {
    const created = item?.createdAt;
    if (!created) continue;

    // const dateString = created?.split('/');

    // const year = Number.parseInt(dateString[2]);

    // const month = Number.parseInt(dateString[0]);
    // const day = Number.parseInt(dateString[1]);
    // const newDate = new Date(year, month - 1, day + 1);
    // newDate.setUTCHours(0);

    const newDate = new Date(created);
    newDate.setHours(7);
    await Customers.updateOne({ _id: item?._id }, { $set: { createdAt: newDate.toISOString() } }, { timestamps: false, strict: false });
  }
  console.log('DONE MIGRATE TIMESTAMP');
}
