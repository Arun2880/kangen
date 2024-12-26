const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consumer",
      required: true,
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer", 
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IndependetUser", 
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
   
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Address", addressSchema);
