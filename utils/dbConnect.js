import mongoose from "mongoose";
import "dotenv/config.js";
const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
// module.exports = {
//   env: {
//     MONGO_URI: "mongodb+srv://test-board:123@cluster0.fyd7i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
//   }
// }
