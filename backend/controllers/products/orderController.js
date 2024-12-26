const Consumer = require("../../models/consumerModel");
const Dealer = require("../../models/dealerModel");
const Address = require("../../models/Address");
const Cart = require("../../models/cart.js");
const Order = require("../../models/Order.js");
const Product = require('../../models/product');
const Independetuser=require("../../models/IndependetUser.js")
const ejs = require("ejs");
const path = require("path");
const htmlPdf = require("html-pdf");
const pdfMake = require("pdfmake/build/pdfmake");
const crypto = require("crypto");
const fs = require("fs");
const puppeteer = require("puppeteer");

const checkDiscount = async (req, res) => {
  const { userId, referralCode } = req.body;

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

    const discountPercentage =
      referralCode === user.referralCode ? user.discount : 0;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    console.log("coupona dode backend response", cart.totals);
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "No items in cart." });
    }

    // let totalAmountBeforeDiscount = 0;
    // for (const item of cart.items) {
    //   totalAmountBeforeDiscount += item.product.sellprice * item.quantity;
    // }

    // const discountAmount = (discountPercentage / 100) * totalAmountBeforeDiscount;
    // console.log("discount money",discountAmount);
    // const totalAmountAfterDiscount = totalAmountBeforeDiscount - discountAmount;

    return res.status(200).json({
      error: false,
      message: "Discount calculated successfully!",
      data: {
        // totalAmountBeforeDiscount,
        // discountAmount,
        // totalAmountAfterDiscount,
        discountPercentage,
        userType,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};







const placeOrder = async (req, res) => {
  const {
    userId,
    referralCode,
    addressId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    totalAmount,
    amountBeforeGst,
    amountAfterGst,
    discountAmount,
  } = req.body;

  try {
    if (!addressId) {
      return res.status(404).json({
        error: true,
        message: "Address not found || Please select an address first",
        data: [null],
      });
    }

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

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      productName: item.product.name,
      productImage: item.product.image,
      quantity: item.quantity,
      price: item.product.sellprice * item.quantity,
    }));

    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found." });
    }

    const order = new Order({
      user: user._id,
      userType,
      name: user.name,
      email: user.email,
      items: orderItems,
      totalAmount,
      amountBeforeGst,
      amountAfterGst,
      discountAmount: discountAmount,
      referralCode: referralCode || null,

      status: "Pending",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.zipCode,
        country: address.country,
        phone: address.phone,
      },
    });

    // Save the order to the database
    await order.save();
    console.log("order data save one");
   const pdfPath = await generatePDF(order);
console.log("order data save two");
    
    // Update the order with the PDF path
    order.pdfPath = pdfPath;

   await order.save();

    // Clear the cart after placing the order
    cart.items = [];
    await cart.save();

    // Return the order details along with user details
    return res.status(201).json({
      error: false,
      message: "Order placed successfully!",
      data: {
        order,
        pdfPath,
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          userType,
        },
      },
    });
  } catch (error) {
    console.error("Error placing order:", error.message, error.stack);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const generatePDF = async (order) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("user data in invoice is ", order);
      const ejsPath = path.join(__dirname, "../../views", "invoice.ejs");
      const uploadDir = path.join(__dirname, "../../uploadpdf");

      // Ensure the upload directory exists
      if (!fs.existsSync(uploadDir)) {
        console.log("Creating upload directory...");
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueFileName = `order_${order._id}_${crypto
        .randomBytes(6)
        .toString("hex")}.pdf`;
      const pdfRelativePath = `uploadpdf/${uniqueFileName}`;
      const pdfAbsolutePath = path.join(__dirname, "../../", pdfRelativePath);

      console.log("Rendering EJS...");
      const html = await ejs.renderFile(ejsPath, { order });
      console.log("EJS rendered successfully.");

      console.log("Launching Puppeteer...");
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      console.log("HTML content set successfully.");

      await page.pdf({
        path: pdfAbsolutePath,
        format: "A4",
        printBackground: true,
      });
      console.log("PDF generated successfully:", pdfAbsolutePath);

      await browser.close();
      resolve(pdfRelativePath);
    } catch (error) {
      console.error("Error generating PDF:", error.message);
      reject(error);
    }
  });
};










const getOrderHistory = async (req, res) => {
  const { id } = req.params;

  try {
    // Try finding the user in both the Consumer and Dealer collections
    let user = await Consumer.findById(id);
    let userType = 'consumer';

    if (!user) {
      user = await Dealer.findById(id);
      userType = 'Dealer';
    }
    if (!user) {
      user = await Independetuser.findById(id);
      userType = 'Independetuser';
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Query for orders associated with the user
    const orders = await Order.find({ user: id })
      .populate("items.product")
      .sort({ orderDate: -1 });

    // Returning both the user data and the associated orders
    return res.status(200).json({
      error: false,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role:user.role,
        referralCode: user.referralCode,
        discount: user.discount,
      },
      orders,
      userType,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};






module.exports = {
  placeOrder,
  getOrderHistory,
  checkDiscount
};
