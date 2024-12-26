const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const dealerSchema = new mongoose.Schema({
 name:{
type:String,
require:true
 },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,

  },
  registeredBy:{
    type:String
  },
  discount:{
    type:Number,
    require:true
  },
  referralCode: {
    type: String,
    required: true,
    unique: true  
  },
  role: { 
    type: String,
    enum: ['admin', 'dealer', 'consumer'], 
    default: 'dealer', 
  },
  addresses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    default: [], 
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  registeredAt: {
    type: Date,
    default: Date.now
  },
  is_deleted:{
    type:Boolean,
    default:0
  }
});


dealerSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');


  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');


  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


dealerSchema.methods.getResetPasswordToken = () => {
  const resetToken = crypto.randomBytes(20).toString("hex");


  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

 
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('Dealer', dealerSchema);
