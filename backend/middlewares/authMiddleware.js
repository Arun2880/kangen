const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const Dealer = require('../models/dealerModel');


exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      error:true,
      message: 'Not authorized, no token' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'admin') {
      req.user = await Admin.findById(decoded.id).select('-password');
    } else if (decoded.role === 'dealer') {
      req.user = await Dealer.findById(decoded.id).select('-password');
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};


exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access restricted to admins' });
  }
};


exports.dealerOnly = (req, res, next) => {
  console.log("user is",req.user);
  if (req.user && req.user.role === 'dealer') {
    next();
  } else {
    res.status(403).json({ message: 'Access restricted to dealers' });
  }
};
