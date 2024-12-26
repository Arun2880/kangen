const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Independetuser = require("../models/IndependetUser");
const Dealer=require("../models/dealerModel");
const Consumer=require("../models/consumerModel");


const generateReferralCode = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase(); 
};


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d", 
  });
};



// -----------------------------------------------Register Dealer----------------------------
const registerDealer = async (req, res) => {
  const { name, email, password, discount } = req.body;

  try {
    if (!discount || isNaN(discount)) {
      return res.status(400).json({
        error: true,
        message: "Invalid or missing discount value",
      });
    }


    const dealerExists = await Dealer.findOne({ email });
    if (dealerExists) {
      return res.status(400).json({
        error: true,
        message: "Dealer already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = generateToken(email, "dealer");
    const referralCode = generateReferralCode();
    const dealer = await Dealer.create({
      name,
      email,
      password: hashedPassword,
      registeredBy: req.user._id,
      token,
      discount: parseFloat(discount),
      referralCode,
    });

    if (dealer) {
      await dealer.save();
      res.status(201).json({
        error: false,
        message: "Dealer registered successfully",
        data: {
          dealer: {
            _id: dealer._id,
            name: dealer.name,
            email: dealer.email,
            discount: dealer.discount,
            registeredBy: req.user._id,
            referralCode: dealer.referralCode,
            token: dealer.token,
          },
        },
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Invalid dealer data",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error while registering dealer",
      details: error.message,
    });
  }
};


// ------------------------------------Login --------------------------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  let user;
  let role;

  try {
    console.log("Email and password are", email, password);

    // Check if the user is an Admin
    user = await Admin.findOne({ email });

 if (user) {
  role = "admin";
  console.log("Admin found");
} else {
  user = await Dealer.findOne({ email });
  if (user) {
    role = "dealer";
    console.log("Dealer found");
  } else {
    user = await Consumer.findOne({ email });
    if (user) {
      role = "consumer";
      console.log("Consumer found");
    } else {
      user = await Independetuser.findOne({ email });
      if (user) {
        role = "Independetuser";
        console.log("Independetuser found");
      } else {
        console.log("No user found");
      }
    }
  }
}
    console.log("Role is", role);
    if (user) {
      console.log("Input Password:", password);
      console.log("Stored Hashed Password:", user.password);

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password Match Result:", isMatch); 

      if (isMatch) {
      
        const token = generateToken(user._id, role);

   
        user.token = token; 
        await user.save();

        return res.json({
          error: false,
          _id: user._id,
          name: user.name,
          email: user.email,
          role,
          token, 
          message: `Logged in as ${role}`,
        });
      }
    }


    res.status(401).json({
      error: true,
      message: "Invalid email or password",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error while logging in",
      details: error.message,
    });
  }
};

// ---------------------------------------------forget password------------------------

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  let user;
  user =
    (await Admin.findOne({ email })) ||
    (await Dealer.findOne({ email })) ||
    (await Consumer.findOne({ email }));

  if (!user) {
    return res.status(404).json({ message: "No user found with this email" });
  }

  
  const resetToken = crypto.randomBytes(20).toString("hex");


  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 


  await user.save();


  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/resetpassword/${resetToken}`;

  
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `You are receiving this email because you requested a password reset. Please go to the following URL to reset your password: \n\n ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Email sent successfully" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).json({ message: "Email could not be sent" });
  }
};

// ----------------------------------------------Reset password--------------------------
const resetPassword = async (req, res) => {
  const { password } = req.body;

  
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

 
  let user;
  user =
    (await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })) ||
    (await Dealer.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })) ||
    (await Consumer.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }));

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }


  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;


  await user.save();

  res.json({ message: "Password reset successful" });
};


// ------------------------------------default admin set--------------------------------------
const createDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: "ak@gmail.com" });
    if (!adminExists) {
   
      const admin = new Admin({
        name: "Kavagie Admin",
        email: "ak@gmail.com",
        password: "ankit@123",
        role: "admin", 
      });
      await admin.save();
      console.log("Default Admin created with email:", admin.email);
    } else {
      console.log("Admin already exists with email:", adminExists.email);
    }
  } catch (error) {
    console.error("Error creating default admin:", error.message);
  }
};

// ----------------------------------logout api----------------------------

const logout = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required for logout",
    });
  }

  try {
    const user =
      (await Admin.findOne({ token })) ||
      (await Dealer.findOne({ token })) ||
      (await Consumer.findOne({ token }))||
      (await Independetuser.findOne({ token }));
    console.log("User is", user);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    user.token = null;
    await user.save();

    return res.json({
      error: false,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error during logout:", error); 
    return res.status(500).json({
      error: true,
      message: "Server error while logging out",
      details: error.message, 
    });
  }
};

module.exports = {
  registerDealer,
  login,
  createDefaultAdmin,
  forgotPassword,
  resetPassword,
  logout,
};
