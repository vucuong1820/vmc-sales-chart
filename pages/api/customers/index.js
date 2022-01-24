import dbConnect from "../../../utils/dbConnect";
import Customers from "../../../models/Customers";
import format from "date-fns/format";

dbConnect();

export default async function handler(req, res) {
  const data = await Customers.find({
    createdAt: format(new Date(), "MM/dd/yyyy"),
  }).exec();
  res.json(data);
}
