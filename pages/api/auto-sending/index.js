import { sendAlert } from "../../../helpers/utils";

export default function handler(req, res) {
  sendAlert();
  res.json("ABC");
}
