const Dealer = require("../models/dealerModel");
const Consumer = require("../models/consumerModel");
const Product = require("../models/product"); // Import the Product model
const multer = require("multer");
const path = require("path");
const Category = require("../models/category/category");
const Order = require("../models/Order");
const Independetuser = require("../models/IndependetUser");


const getAllDealersWithConsumers = async (req, res) => {
  try {
    const dealers = await Dealer.find({ is_deleted: 0 }).populate(
      "registeredBy",
      "name email"
    );

    if (!dealers) {
      return res.status(400).json({
        error: true,
        message: "No dealers found...",
        data: [dealers],
      });
    }

    return res.status(200).json({
      error: true,
      message: "All dealter list here..",
      data: [dealers],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


const getAllConsumersWithDealers = async (req, res) => {
  try {
    
    const consumers = await Consumer.find().populate(
      "registeredBy",
      "name email"
    );

    console.log("admin consumers", consumers);

    
    if (!consumers || consumers.length === 0) {
      return res.status(400).json({
        error: true,
        message: "No consumers found",
      });
    }

    
    return res.status(200).json({
      error: false, 
      message: "All consumers data",
      data: consumers, 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------get any single dealer whole data---------------------

const Getsingledealer = async (req, res) => {
  const id = req.params.id; 
  try {
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || missing id",
      });
    }


    const getdealer = await Dealer.findById(id, { is_deleted: 0 });

    if (!getdealer) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Dealer data is here",
      data: getdealer, 
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      details: error.message, 
    });
  }
};

// -----------------------------------delete any dealer---------------------

const Deldealer = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Id missing",
      });
    }

    const outdealer = await Dealer.findByIdAndUpdate(
      id,
      { is_deleted: 1 },
      { new: true }
    );

    return res.status(200).json({
      error: true,
      message: "dealter deleted Successfully..",
      data: [outdealer],
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// -------------------------update any dealer-----------------------------

const Updatedealer = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, discount } = req.body;

  try {
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Id missing ",
      });
    }

    const newdealer = {
      name,
      email,
      password,
      discount,
    };
    const change = await Dealer.findByIdAndUpdate(id, newdealer, { new: true });

    return res.status(200).json({
      error: false,
      message: "Dealer data updated successfully.",
      data: [change],
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// ---------------------------------- get consumers of particuler dealer-------------------

const Getconsumerdealer = async (req, res) => {
  const { dealerId } = req.params; 

  try {
  
    const consumers = await Consumer.find({
      registeredBy: dealerId, 
      is_deleted: 0, 
    });

    if (!consumers || consumers.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No consumers found registered by this dealer",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Consumers registered by this dealer retrieved successfully",
      data: consumers,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error while retrieving consumers",
      details: error.message,
    });
  }
};

// --------------------------------------- update consumer----------------------

const Updateconsumer = async (req, res) => {
  const { id } = req.params;

  const { name, discount } = req.body;
  try {
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || ID missing ",
      });
    }

    const newdata = {
      name,
      discount,
    };

    const updatedata = await Consumer.findByIdAndUpdate(id, newdata, {
      new: true,
    });

    if (!updatedata) {
      return res.status(400).json({
        error: true,
        message: "Consumer not updated...",
      });
    }

    return res.status(200).json({
      error: true,
      message: "Consumer updated successfully..",
      data: updatedata,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// --------------------------------Delete Consumer-----------------------------

const Delconsumer = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Missing ID",
      });
    }

    const deleteconsumer = await Consumer.findByIdAndUpdate(
      id,
      { is_deleted: 1 },
      { new: true }
    );

    if (!deleteconsumer) {
      return res.status(400).json({
        error: true,
        message: "Consumer not delete...",
      });
    }

    return res.status(200).json({
      error: true,
      message: "Consumer deleted successfully.",
      data: deleteconsumer,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// ---------------------------------add product------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Set the directory for uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the filename with a timestamp
  },
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Not an image! Please upload an image."), false); // Reject the file
  }
};


const upload = multer({ storage, fileFilter });

const AddProduct = async (req, res) => {
  const { name, price, sellprice, category, brand, stock, discription, gst } =
    req.body;

  const image = req.file ? req.file.path.replace(/\\/g, "/") : null;

  try {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (!name || !price || !sellprice || !image || !category || !gst) {
      return res.status(400).json({
        error: true,
        message: "Name, price, sellprice, image, and category are required.",
      });
    }

    const product = new Product({
      name: name.trim(),
      image,
      discription: discription ? discription.trim() : null,
      price: price.trim(),
      sellprice: sellprice.trim(),
      category: category.trim(),
      gst: gst.trim(),
      categoryName: categoryExists.name,
      brand: brand ? brand.trim() : null,
      stock: stock ? stock.trim() : null,
    });

    await product.save();

    return res.status(200).json({
      error: false,
      message: "Product added successfully!",
      data: [product]
       
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// -----------------------------------get product list--------------------

const Getproducts = async (req, res) => {
  try {
    const productdata = await Product.find({ is_deleted: {$ne:1} });

    if (!productdata || productdata.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No product found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Product list here",
      data: productdata,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};
// --------------------------------------------------delete product----------------------------

const Delproduct = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Internal server error",
      });
    }

    const productdelete = await Product.findByIdAndUpdate(
      id,
      { is_deleted: 1 },
      { new: true }
    );

    if (!productdelete) {
      return res.status(400).json({
        error: true,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Product delete successfully.",
      data: productdelete,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// ---------------------------------update product-------------------------------

const Updateproduct = async (req, res) => {
  const { id } = req.params;
  const { name, sellprice, price, brand, stock } = req.body;

  try {
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || ID missing",
      });
    }

    const newpro = {
      name,
      sellprice,
      price,
      brand,
      stock,
    };

    const proupdate = await Product.findByIdAndUpdate(id, newpro, {
      new: true,
    });

    if (!proupdate) {
      return res.status(400).json({
        error: true,
        message: "Product not updated",
      });
    }

    return res.status(200).json({
      error: false, 
      message: "Product updated Successfully.",
      data: proupdate,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// --------------------------------get all consumers------------------

const Getallconsumer = async (req, res) => {
  try {
    const getlist = await Consumer.find();

    if (getlist.length === 0) {
      return res.status(404).json({
        error: true,
        message: "NO consumer found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Consumer list",
      data: getlist,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// ------------------------------------------------earn commision-------------

const Dealerorder = async (req, res) => {
  const { id } = req.params; 

  try {
    if (!id) {
      return res.status(404).json({
        error: true,
        message: "Something went wrong || ID is missing",
      });
    }

    const dealer = await Dealer.findById(id);
    if (!dealer) {
      return res.status(404).json({
        error: true,
        message: "Dealer not found",
      });
    }


    const orders = await Order.find({ user: id, userType: "Dealer" }).populate({
      path: "items.product", 
      select: "name price", 
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No orders found for this dealer",
      });
    }


    return res.status(200).json({
      error: false,
      message: "Orders found for the dealer",
      totalOrders: orders.length, 
      orders: orders, 
    });
  } catch (error) {
    console.error(error); 
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// ------------------------consumers order----------------------

const Consumerorder = async (req, res) => {
  const { id } = req.params; // Consumer ID

  try {
    if (!id) {
      return res.status(404).json({
        error: true,
        message: "Something went wrong || ID is missing",
      });
    }

    // Step 1: Find the consumer by ID
    const consumer = await Consumer.findById(id);
    if (!consumer) {
      return res.status(404).json({
        error: true,
        message: "Consumer not found",
      });
    }


    const orders = await Order.find({ user: id, userType: "consumer" }) 
      .populate({
        path: "items.product",
        select: "name price", 
      });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No orders found for this consumer",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Orders found for the consumer",
      totalOrders: orders.length, 
      orders: orders, 
    });
  } catch (error) {
    console.error("Error fetching consumer orders:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};


// ------------------------------------------get all User not register by anyone-----------

const Getallusers=async(req,res)=>{

  try{

    const Allusers=await Independetuser.find({is_deleted:{$ne:1}});

    if(Allusers.length===0){
      return res.status(404).json({
        error:true,
        message:"Users not found"
      })
    }

    return res.status(200).json({
      error:false,
      message:"User list",
      data:Allusers
    })



  }catch(error){
    return res.status(500).json({
      error:true,
      message:"Internal server error"
    })
  }
}



// -----------------------------------------Delete users self register-------------


const Deluser=async(req,res)=>{

  const {id}=req.params;
  try{

    if(!id){
      return res.status(400).json({
        error:true,
        message:"Something went wrong || ID missing"
      })
    }

    const user=await Independetuser.findByIdAndUpdate(id,{is_deleted:1},{new:true});

    if(!user){
      return res.status(404).json({
        error:true,
        message:"User not found for delete"
      })
    }


    return res.status(200).json({
      error:false,
      message:"User deleted successfully..",
      data:user
    })

    
  }catch(error){

    return res.status(500).json({
      error:true,
      message:"Internal server error"
    })
  }
}






module.exports = {
  getAllDealersWithConsumers,
  getAllConsumersWithDealers,
  Getsingledealer,
  Deldealer,
  Updatedealer,
  Getconsumerdealer,
  Delconsumer,
  Updateconsumer,
  upload,
  AddProduct,
  Getproducts,
  Delproduct,
  Updateproduct,
  Getallconsumer,

  Dealerorder,
  Consumerorder,
  Getallusers,
  Deluser
  // Earndealercommission
};
