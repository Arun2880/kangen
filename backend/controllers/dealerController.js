const Consumer = require('../models/consumerModel');
const Dealer = require('../models/dealerModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Order = require('../models/Order');


const generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase(); 
};


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', 
  });
};

const registerConsumer = async (req, res) => {
  const { name, email, password, discount } = req.body;

  try {
    if (discount === undefined || discount < 0 || discount > 100) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Discount is missing or invalid"
      });
    }

    const consumerExists = await Consumer.findOne({ email });
    if (consumerExists) {
      return res.status(400).json({
        error: true, 
        message: 'Consumer already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = generateReferralCode();
    const token = generateToken(email, 'consumer');

    const consumer = await Consumer.create({
      name,
      email,
      password: hashedPassword,
      registeredBy: req.user._id,  
      referralCode,
      discount,
      token,
      role: 'consumer'
    });

    const dealer = await Dealer.findById(req.user._id);
    if (!dealer) {
      return res.status(404).json({
        error: true,
        message: 'Dealer not found'
      });
    }

    if (!dealer.consumers) {
      dealer.consumers = [];
    }

    dealer.consumers.push(consumer._id);  
    await dealer.save();

    return res.status(201).json({
      error: false,
      message: 'Consumer registered successfully',
      data: {
        consumer: {
          _id: consumer._id,
          name: consumer.name,
          email: consumer.email,
          discount: consumer.discount,
          referralCode: consumer.referralCode,
          token: consumer.token,
          role: consumer.role
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Server error while registering consumer',
      details: error.message
    });
  }
};




// ---------------------------get all consumers data register by him----------------
const getMyConsumers = async (req, res) => {
  try {
    console.log("user", req.user._id);


    const consumers = await Consumer.find({ 
      registeredBy: req.user._id, 
      is_deleted: { $ne: 1 } 
    });

    return res.status(200).json({
      error: false,
      message: "Consumers list.",
      data: consumers
    });

  } catch (error) {
    console.error("Error fetching consumers:", error); 
    return res.status(500).json({
      error: true,
      message: 'Server error'
    });
  }
};



// --------------------------------------Get single consumer -----------------------------
const Singleconsumer = async(req, res) => {
  const { id } = req.params; 

  try {
   
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || missing ID"
      });
    }

   
    const Getconsumer = await Consumer.findOne({_id:id,is_deleted:{$ne:1}});
console.log("Consumer data",Getconsumer);
    if (!Getconsumer) {
      return res.status(400).json({
        error: true,
        message: "Consumer not found or unauthorized"
      });
    }

 
    return res.status(200).json({
      error: false,
      message: "Consumer data is here..",
      data: Getconsumer
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
}


// ---------------------------------const update any consumer-------------------------

const Updateconsumer=async(req,res)=>{
  const {id}=req.params;
  const {name,discount}=req.body;

  try{

    if(!id){
      return res.status(400).json({
        error:true,
        message:"Something went wrong || Missing ID"
      })
    }

    const Updatecons={
      name,
      discount
    }

    const updatecosnsumer=await Consumer.findByIdAndUpdate(id,Updatecons,{new:true});

    if(!updatecosnsumer){
      return res.status(400).json({
        error:true,
        message:"Consumer not found.."
      })
    }

    return res.status(200).json({
      error:true,
      message:"Consumer data ..",
      data:[updatecosnsumer]
    })



  }catch(error){
    return res.status(500).json({
      error:true,
      message:"Internal server error"
    })
  }

}


// -----------------------------Delete consumer-------------------------

const Deleteconsumer = async (req, res) => {
 
  const {id}=req.params;

  try{

    if(!id){
      return res.status(400).json({
        error:true,
        message:"Something went wrong || ID missing"
      })
    }

    const delconsumer=await Consumer.findByIdAndUpdate(id,{is_deleted:1},{new:true});

    if(!delconsumer){
      return res.status(404).json({
        error:true,
        message:"consumer not found"
      })
    }

    return res.status(200).json({
      error:false,
      message:"Consumer deleted successfully..",
      data:delconsumer
    })


  }catch(error){
    return res.status(500).json({
      error:true,
      message:"Internal server error"
    })
  }
};


// -----------------------------------get order list using it's refral code--------------------


const Getorderlist = async (req, res) => {
  try {
    
    const dealerId = req.user._id;
console.log("dealer",dealerId);
    if (!dealerId) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Dealer ID missing",
      });
    }

    const dealer = await Dealer.findById(dealerId);

    if (!dealer) {
      return res.status(404).json({
        error: true,
        message: "Dealer not found",
      });
    }

    
    const getOrders = await Order.find({ referralCode: dealer.referralCode }).populate('items.product');

    if (getOrders.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No orders found using your referral code",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Order list for the dealer.",
      data: getOrders,
    });

  } catch (error) {
    console.error("Error fetching orders:", error); 
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};



// -----------------------------get all order data with or without refral code------------------

const GetDealerOrders = async (req, res) => {
  const dealerId = req.user._id;

  try {
    
    if (!dealerId) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Dealer ID missing",
      });
    }

    const dealer = await Dealer.findById(dealerId);

    if (!dealer) {
      return res.status(404).json({
        error: true,
        message: "Dealer not found",
      });
    }

   
    const dealerOrders = await Order.find({ user: dealer._id, userType: "Dealer" }).populate('items.product');

   
    const consumerOrders = await Order.find({ referralCode: dealer.referralCode, userType: "Consumer" }).populate('items.product');

    
    const allOrders = [...dealerOrders, ...consumerOrders];

    
    if (allOrders.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No orders found for this dealer or its consumers",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Order list for the dealer and consumers",
      data: allOrders,
    });

  } catch (error) {
    
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};



// ----------------------------total commission of dealer--------------------------




const GetTotalDealerCommission = async (req, res) => {
  const { id } = req.params; 

  try {
  
      const dealer = await Dealer.findById(id);
      if (!dealer) {
          return res.status(404).json({
              error: true,
              message: "Dealer not found",
          });
      }
      console.log("dealer data", dealer);

     
      const consumers = await Consumer.find({ registeredBy: id });
      if (!consumers || consumers.length === 0) {
          return res.status(404).json({
              error: true,
              message: "No consumers registered by this dealer",
          });
      }

      
      let totalCommissionAcrossConsumers = 0;

     
      const consumerDataWithOrders = await Promise.all(consumers.map(async (consumer) => {
          const orders = await Order.find({ user: consumer._id }); 

       
          let totalDealerCommission = 0;

          const orderWithCommission = orders.map(order => {
              const totalAmount = order.totalAmount; 
              const consumerDiscount = consumer.discount; 
              console.log("Consumer discount", consumerDiscount);
              const dealerDiscount = dealer.discount || 0; 
              console.log("Dealer discount", dealerDiscount);

            
              const isReferralUsed = order.referralCode ? true : false; 

              if (!isReferralUsed) {
                  
                  console.log("No referral code used for this order. No commission.");
                  return {
                      ...order.toObject(),
                      dealerCommission: 0, 
                  };
              }

              
              const remainingDiscountPercentage = dealerDiscount - consumerDiscount;
              console.log("Remaining discount", remainingDiscountPercentage);
              
              
              const dealerCommission = Math.max(0, (remainingDiscountPercentage / 100) * totalAmount);

              totalDealerCommission += dealerCommission;

              return {
                  ...order.toObject(),
                  dealerCommission, 
              };
          });

          
          totalCommissionAcrossConsumers += totalDealerCommission;

          return {
              consumer,
              orders: orderWithCommission, 
              totalDealerCommission, 
          };
      }));

    
      return res.status(200).json({
          error: false,
          message: "Consumer list with orders and dealer commission",
          data: {
              consumers: consumerDataWithOrders,
              totalCommission: totalCommissionAcrossConsumers 
          }
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({
          error: true,
          message: "Internal server error",
      });
  }
};








module.exports={registerConsumer,getMyConsumers,Singleconsumer,Updateconsumer,Deleteconsumer,Getorderlist,GetDealerOrders,GetTotalDealerCommission}