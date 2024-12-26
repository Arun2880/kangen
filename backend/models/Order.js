const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  productName: {
    type: String,
  },
  productImage: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userType",
    required: true,
  },
  userType: {
    type: String,
    enum: ["consumer", "Dealer", "Independetuser"],
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: false,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String,
    default: null,
  },

  phone: {
    type: String,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Completed", "Cancelled"],
  },
  razorpay_order_id: {
    type: String,
  },
  razorpay_payment_id: {
    type: String,
  },
  razorpay_signature: {
    type: String,
  },
  amountBeforeGst: {
    type: String,
  },
  amountAfterGst: {
    type: String,
  },
  name: {
    type: String,
  },
  pdfPath: {
    type: String,
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    phone: { type: String },
  },
});

module.exports = mongoose.model("Order", orderSchema);
