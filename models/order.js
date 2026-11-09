const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userEmail: String,
  username: String,
  books: Array,
  totalAmount: Number,
  paymentMethod: String,
  orderTime: String
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
