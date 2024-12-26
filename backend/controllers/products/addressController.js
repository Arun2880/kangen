const Address = require("../../models/Address");
const Consumer = require("../../models/consumerModel");
const Dealer = require("../../models/dealerModel");
const Independetuser = require("../../models/IndependetUser");

// Add a new address
const addAddress = async (req, res) => {
  const {
    consumerId,
    street,
    city,
    state,
    zipCode,
    country,
    isDefault,
    phone,
  } = req.body;

  try {
    const address = new Address({
      consumer: consumerId,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault,
      phone,
    });

    const consumer = await Consumer.findById(consumerId);
    if (consumer) {
      await address.save();
      consumer.addresses.push(address._id);
      await consumer.save();

      return res.status(201).json({
        error: false,
        message: "Address added successfully!",
        data: address,
      });
    }

    const dealer = await Dealer.findById(consumerId);
    if (dealer) {
      await address.save();
      dealer.addresses.push(address._id);
      await dealer.save();

      return res.status(201).json({
        error: false,
        message: "Address added successfully!",
        data: address,
      });
    }

    const user = await Independetuser.findById(consumerId);
    if (user) {
      await address.save();
      user.addresses.push(address._id);
      await user.save();

      return res.status(201).json({
        error: false,
        message: "Address saved successfully for the user!",
        data: address,
      });
    }

    return res.status(404).json({
      error: true,
      message: "Consumer, Dealer, or User not found.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Get all addresses for a user
const getAddresses = async (req, res) => {
  const { id } = req.params;

  try {
    const addresses = await Address.find({
      consumer: id,
      is_deleted: { $ne: true },
    });

    if (!addresses || addresses.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No addresses found for this consumer.",
      });
    }

    return res.status(200).json({
      error: false,
      data: addresses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Delete (mark as deleted) an address
const Deleteaddress = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Address ID missing.",
      });
    }

    const deladdress = await Address.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!deladdress) {
      return res.status(404).json({
        error: true,
        message: "Address not found.",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Address marked as deleted successfully.",
      data: deladdress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Update an address
const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { street, city, state, zipCode, country, phone } = req.body;

  try {
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Address ID is missing.",
      });
    }

    const data = { street, city, state, zipCode, country, phone };

    const updatedData = await Address.findByIdAndUpdate(id, data, { new: true });

    return res.status(200).json({
      error: false,
      message: "Address updated successfully.",
      data: updatedData,
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
  addAddress,
  getAddresses,
  Deleteaddress,
  updateAddress,
};
