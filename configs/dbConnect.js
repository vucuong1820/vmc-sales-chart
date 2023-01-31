const mongoose = require('mongoose');
require('dotenv').config();

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  });

  // mongoose.set('debug', true);

  connection.isConnected = db.connections[0].readyState;
  // eslint-disable-next-line no-console
}

module.exports = dbConnect;
