const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const IndependetUser = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  role: { 
    type: String,
    enum: ['admin', 'dealer', 'consumer','Independetuser'], 
    default: 'Independetuser', 
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  cart: [cartItemSchema],
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      default: [],
    },
  ],
});

module.exports = mongoose.model("Independetuser", IndependetUser);
