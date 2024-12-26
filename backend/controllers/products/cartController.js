const Cart = require("../../models/cart");
const Product = require("../../models/product");
const Consumer = require("../../models/consumerModel");
const Dealer = require("../../models/dealerModel");
const Independetuser=require("../../models/IndependetUser");

const addToCart = async (req, res) => {
  const { userId, products } = req.body;

  try {
  
    let user = await Consumer.findById(userId);
    let userType = "consumer";

    if (!user) {
    
      user = await Dealer.findById(userId);
      userType = "Dealer";
    }
    
    if (!user) {
     
      user = await Independetuser.findById(userId);
      userType = "Independetuser";
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

  
    let cart = await Cart.findOne({ user: userId, userType });
    if (!cart) {
      console.log(
        "Creating a new cart for user:",
        userId,
        "with userType:",
        userType
      );
      cart = new Cart({ user: userId, userType, items: [] });
    }

    let totalAmount = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        console.error(`Product not found: ${item.productId}`);
        return res
          .status(400)
          .json({ message: `Product not available: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        console.error(`Insufficient stock for product: ${item.productId}`);
        return res.status(400).json({
          message: `Insufficient stock for product: ${item.productId}`,
        });
      }

      const itemPrice = product.sellprice * item.quantity;
      totalAmount += itemPrice;

      const existingItemIndex = cart.items.findIndex((cartItem) =>
        cartItem.product.equals(product._id)
      );
      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += item.quantity;
        cart.items[existingItemIndex].price =
          product.sellprice * cart.items[existingItemIndex].quantity;
      } else {
        cart.items.push({
          product: product._id,
          quantity: item.quantity,
          price: itemPrice,
        });
      }
    }

    cart.totalAmount = totalAmount;

    try {
      console.log(
        "Attempting to save cart for user:",
        userId,
        "with userType:",
        userType
      );
      await cart.save();
      console.log("Cart saved successfully for user:", userId);
    } catch (err) {
      console.error("Error saving cart: ", err);
      return res
        .status(500)
        .json({ error: true, message: "Failed to save cart." });
    }

    return res.status(201).json({
      error: false,
      message: "Products added to cart successfully!",
      data: {
        _id: cart._id,
        userType: userType,
        items: cart.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cart.totalAmount,
      },
    });
  } catch (error) {
    console.error("Error details: ", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// View Cart
// const getCart = async (req, res) => {
//   const { id } = req.params;

//   try {
// let user = await Consumer.findById(id);
// console.log("Consumer search result:", user);

// if (!user) {
//   user = await Dealer.findById(id);

//   userType = 'Dealer';
// }

// if (!user) {

//   return res.status(404).json({ error: true, message: "User not found" });
// }

//     const cart = await Cart.findOne({ user: id, userType }).populate("items.product");
// console.log("cart is ",cart);
//     if (!cart || cart.items.length === 0) {
//       return res.status(404).json({ error: true, message: "No items in cart" });
//     }

//     const cartItems = cart.items.map((item) => ({
//       product: {
//         _id: item.product._id,
//         name: item.product.name,
//         sellprice: item.product.sellprice,
//         image: item.product.image, // Add other product fields as needed
//       },
//       quantity: item.quantity,
//       price: item.price,
//     }));

//     return res.status(200).json({
//       error: false,
//       data: {
//         _id: cart._id,
//         userType: userType,
//         items: cartItems,
//         totalAmount: cart.totalAmount,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ error: true, message: "Internal server error" });
//   }
// };



const getCart = async (req, res) => {
  const { id } = req.params;

  try {
    let user = await Consumer.findById(id);
    let userType = "consumer";
    if (!user) {
      user = await Dealer.findById(id);
      if (user) {
        userType = "Dealer";
      }
    }

    if (!user) {
      user = await Independetuser.findById(id);
      if (user) {
        userType = "Independetuser";
      }
    }

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const cart = await Cart.findOne({ user: id, userType }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ error: true, message: "No items in cart" });
    }

    // Initialize totals
    let subtotalWithoutGst = 0;
    let gstTotal = 0;
    let subtotalWithGst = 0;

    // Process cart items and calculate totals
    const cartItems = cart.items.map((item) => {
      const sellPrice = Number(item.product.sellprice); // Convert to number
      const gstRate = Number(item.product.gst); // Convert to number
      const quantity = Number(item.quantity); // Convert to number

      // Calculate GST and total prices
      const gstAmountPerUnit = sellPrice * (gstRate / 100);
      const priceWithGstPerUnit = sellPrice + gstAmountPerUnit;

      const gstAmount = gstAmountPerUnit * quantity;
      const priceWithGst = priceWithGstPerUnit * quantity;

      subtotalWithoutGst += sellPrice * quantity;
      gstTotal += gstAmount;
      subtotalWithGst += priceWithGst;

      return {
        product: {
          _id: item.product._id,
          name: item.product.name,
          sellprice: sellPrice,
          image: item.product.image,
          gst: gstRate,
        },
        quantity,
        priceWithoutGst: Number((sellPrice * quantity).toFixed(2)),
        gstAmount: Number(gstAmount.toFixed(2)),
        priceWithGst: Number(priceWithGst.toFixed(2)),
      };
    });

    // Send totals explicitly without modifying the cart object
    return res.status(200).json({
      error: false,
      data: {
        _id: cart._id,
        userType,
        items: cartItems,
        totals: {
          subtotalWithoutGst: Number(subtotalWithoutGst.toFixed(2)),
          gstTotal: Number(gstTotal.toFixed(2)),
          subtotalWithGst: Number(subtotalWithGst.toFixed(2)),
        },
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};


// Remove from Cart
const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let user = await Consumer.findById(userId);
    let userType = "consumer";

    if (!user) {
      user = await Dealer.findById(userId);
      userType = "Dealer";
    }
    if (!user) {
      user = await Independetuser.findById(userId);
      userType = "Independetuser";
    }

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const cart = await Cart.findOne({ user: userId, userType });
    if (!cart) {
      return res.status(404).json({ error: true, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found in cart" });
    }

    const itemPrice = cart.items[itemIndex].price;

   
    cart.items.splice(itemIndex, 1);
    cart.totalAmount -= itemPrice; 

    await cart.save();

    return res
      .status(200)
      .json({ error: false, message: "Product removed from cart", data: cart });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const updateCartItemQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let user = await Consumer.findById(userId);
    let userType = "consumer";

    if (!user) {
      user = await Dealer.findById(userId);
      userType = "Dealer";
    }

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const cart = await Cart.findOne({ user: userId, userType });
    if (!cart) {
      return res.status(404).json({ error: true, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found in cart" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ message: "Product not available in required quantity." });
    }

    const basePrice = product.sellprice;
    const newPrice = basePrice * quantity;

    
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = newPrice;

   
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price,
      0
    );

    await cart.save();

    return res
      .status(200)
      .json({ error: false, message: "Cart updated successfully", data: cart });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
};
