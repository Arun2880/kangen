const express = require("express");

const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} = require("../controllers/products/cartController");
const {
  addAddress,
  getAddresses,
  Deleteaddress,
  updateAddress,
} = require("../controllers/products/addressController");

const {
  placeOrder,
  getOrderHistory,
  checkDiscount,
} = require("../controllers/products/orderController");

const {
  GetOrderList,
  GetConsumerOrders,
} = require("../controllers/consumerController");

// --------------------------------------cart routes--------------------------------
router.post("/addcart", addToCart);
router.get("/getcart/:id", getCart);
router.post("/removecart", removeFromCart);
router.put("/updatecart", updateCartItemQuantity);

// --------------------------------address route----------------------------------------

router.post("/deliveryaddress", addAddress);
router.get("/alladdress/:id", getAddresses);
router.delete("/deladdress/:id", Deleteaddress);
router.put("/updateaddress/:id", updateAddress);

// -----------------------------------------order routes------------------------------
router.post("/doneorder", placeOrder);
router.get("/gethistory/:id", getOrderHistory);
router.post("/checkdiscount", checkDiscount);

// -------------------------------get consumer routes----------------------------

router.get("/orderrefral/:id", GetOrderList);
router.get("/fullorder/:id", GetConsumerOrders);

module.exports = router;
