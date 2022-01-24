const mongoose = require("mongoose");

const CustomersSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  themeId: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  created_at: {
    type: String,
  },
  url: {
    type: String,
  },
});

module.exports =
  mongoose.models.Customers || mongoose.model("Customers", CustomersSchema);
