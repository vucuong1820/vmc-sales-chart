const mongoose = require('mongoose');

const CustomersSchema = new mongoose.Schema(
  {
    name: String,
    themeId: Number,
    quantity: Number,
    created_at: String,
    url: String,
    review: Number,
    sales: Number,
    reviewQuantity: Number,
    reviewsPerDay: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.models.Customers || mongoose.model('Customers', CustomersSchema);
