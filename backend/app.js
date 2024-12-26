const express = require("express");
const cors = require("cors");
const path = require("path");
const Razorpay= require("razorpay");

// initialize express
const app = express();

// setup cors
app.use(cors({
  origin: "http://localhost:4000",
  origin: "0.0.0.0",
  ceredentials: true
}));

app.use(cors({
  origin: 'https://enagickangenwater.org' // Replace with your actual frontend domain
}));
// setup json
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.urlencoded({extended:true}));

// Api routes 
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/dealer", require("./routes/dealerRoutes"));
app.use("/api/shop", require("./routes/allroutes"));
app.use("/api/blog", require("./routes/blogRoutes"));
app.use("/api/user", require("./routes/Independetuserroutes"));
app.use("/api/payment",require("./routes/paymentroute"));

// server static files
app.use("/uploads", express.static("uploads"));
app.use("/uploadpdf", express.static(path.join(__dirname, "uploadpdf")));
app.use("/images", express.static("images"));
app.use("/invoices", express.static("public/invoices"));


// serve frontend build
// const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "..", "frontend", "build", "index.html")),
);




module.exports = app;
