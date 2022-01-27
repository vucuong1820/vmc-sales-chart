import dbConnect from "../../../utils/dbConnect";
import Customers from "../../../models/Customers";
import format from "date-fns/format";

dbConnect();

export default async function handler(req, res) {
  const { startingDay, endingDay } = req.query;
  await Customers.find({
    created_at: {
      $gte: startingDay,
      $lte: endingDay,
    },
  })
    .exec()
    .then((data) => res.json(data));
}
