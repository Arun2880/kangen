const mongoose = require("mongoose");

// Define the schema for cart items first
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

// Define the consumer schema
const consumerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  registeredBy:{
    type:String
  },
  referralCode: {
    type: String,
  },
  addresses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    default:[] 
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: { 
    type: String,
    enum: ['admin', 'dealer', 'consumer'], 
    default: 'consumer', 
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order", 
  }],
  cart: [cartItemSchema], 
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Consumer", consumerSchema);
