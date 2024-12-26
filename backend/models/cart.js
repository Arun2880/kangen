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
  price: {
    type: Number,
    required: true, 
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userType', 
  },
  userType: {
    type: String,
    required: true,
    enum: ['consumer', 'Dealer', 'Independetuser'], 
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0, 
  },
  subtotalWithoutGst: {
    type: Number,
    required: true,
    default: 0,
  },
  gstTotal: {
    type: Number,
    required: true,
    default: 0,
  },
  subtotalWithGst: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
