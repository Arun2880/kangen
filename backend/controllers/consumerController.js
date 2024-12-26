const Consumer = require('../models/consumerModel');
const Dealer = require('../models/dealerModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Order = require('../models/Order');



// --------------------get refral code orders-----------------------------

const GetOrderList = async (req, res) => {
    const { id } = req.params;
  
    try {
     
      if (!id) {
        return res.status(400).json({
          error: true,
          message: "Something went wrong || Consumer ID missing",
        });
      }
  
     
      const consumer = await Consumer.findById(id); 
  
      if (!consumer) {
        return res.status(404).json({
          error: true,
          message: "Consumer not found",
        });
      }
  
     
      const getOrders = await Order.find({ referralCode: consumer.referralCode }).populate('items.product');
  
      
      if (getOrders.length === 0) {
        return res.status(404).json({
          error: true,
          message: "No orders found using your referral code",
        });
      }

      let totalEarnings = 0;
      let totalItemsPurchased = 0;
  
      getOrders.forEach(order => {
        totalEarnings += order.totalAmount;
        order.items.forEach(item => {
          totalItemsPurchased += item.quantity;
        });
      });
  
   
      return res.status(200).json({
        error: false,
        message: "Order list for the consumer.",
        data: getOrders,
        totalEarnings: totalEarnings,
        totalItemsPurchased: totalItemsPurchased
      });
  
    } catch (error) {
 
      return res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  };
  


//   --------------------------------------get order without refral------------------


const GetConsumerOrders = async (req, res) => {
    const { id } = req.params;
  
    try {
    
      if (!id) {
        return res.status(400).json({
          error: true,
          message: "Something went wrong || Consumer ID missing",
        });
      }
  

      const consumer = await Consumer.findById(id);
  
      if (!consumer) {
        return res.status(404).json({
          error: true,
          message: "Consumer not found",
        });
      }
  
      const getOrders = await Order.find({ user: consumer._id, userType: "Consumer" }).populate('items.product');
  
     
      if (getOrders.length === 0) {
        return res.status(404).json({
          error: true,
          message: "No orders found for this consumer",
        });
      }
  

      let totalEarnings = 0;
      let totalItemsPurchased = 0;
  
      getOrders.forEach(order => {
        totalEarnings += order.totalAmount;
        order.items.forEach(item => {
          totalItemsPurchased += item.quantity;
        });
      });
  
     
      return res.status(200).json({
        error: false,
        message: "Order list for the consumer",
        data: getOrders,
        totalEarnings: totalEarnings,
        totalItemsPurchased: totalItemsPurchased
      });
  
    } catch (error) {
     
      return res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  };
  


  module.exports={GetOrderList,GetConsumerOrders};