const express = require("express");
const {
  registerConsumer,
  getMyConsumers,
  Singleconsumer,
  Updateconsumer,
  Deleteconsumer,
  Getorderlist,
  GetDealerOrders,
  GetTotalDealerCommission
} = require("../controllers/dealerController");
const { protect, dealerOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Dealer routes
router.post("/consumers", protect, dealerOnly, registerConsumer);
router.get("/mycon", protect, dealerOnly, getMyConsumers);
router.get("/singleconsumer/:id", protect, dealerOnly, Singleconsumer);
router.put("/updateconsumer/:id",protect,dealerOnly,Updateconsumer);
router.delete('/delconsumer/:id',protect,dealerOnly,Deleteconsumer);
router.get('/getorder',protect,dealerOnly,Getorderlist);
router.get("/allorders",protect,dealerOnly,GetDealerOrders);
router.get('/earncommission/:id',GetTotalDealerCommission);







module.exports = router;
