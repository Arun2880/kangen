const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },

  brand: {
    type: String,
  },
  price: {
    type: String,
    require: true,
  },
  sellprice: {
    type: String,
  },
  stock: {
    type: String,
  },
  discription: {
    type: String,
  },
  gst: {
    type: Number, 
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  categoryName: {
    type: String,
  },

  is_deleted: {
    type: Boolean,
    default: 0,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
