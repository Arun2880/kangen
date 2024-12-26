const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Independetuser = require("../models/IndependetUser");
const Admin = require("../models/adminModel");
const Dealer = require("../models/dealerModel");
const Consumer = require("../models/consumerModel");

const RegisterUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!email || !username || !password) {
            return res.status(400).json({
                error: true,
                message: "Email, username, and password are required."
            });
        }

      
        const existingUser = await Independetuser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: true,
                message: "User already exists."
            });
        }

   
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new Independetuser({
            username,
            email,
            password: hashedPassword 
        });

        await newUser.save();

       
        const token = jwt.sign(
            { id: newUser._id, role: "user" }, 
            process.env.JWT_SECRET,
            { expiresIn: "1h" } 
        );

        return res.status(200).json({
            error: false,
            message: "User registered successfully.",
            data: newUser,
            token 
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            details: error.message
        });
    }
};

module.exports = { RegisterUser };
