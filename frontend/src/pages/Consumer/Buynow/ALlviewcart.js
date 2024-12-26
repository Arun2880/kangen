import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { FaPencilAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import "./product.css";
import { useNavigate } from "react-router-dom";
import BASE_url  from "../../../config/constants";



const ALIviewcart = () => {
  
  let cartdata = "";
  const token = sessionStorage.getItem("Token");
  //const BASE_url = "http://localhost:5000";
  const [UserID, setUserID] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [totalamount, setTotalamount] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [refral, setRefral] = useState("");
  const [discount, setdiscount] = useState("");
  const [finalamount, setFinalamount] = useState("");
   const [newrazorpay_order_id, setrazorpay_order_id] = useState("");
  const [newrazorpay_payment_id, setrazorpay_payment_id] = useState("");
  const [newrazorpay_signature, setrazorpay_signature] = useState("");
    const [subtotal, setsubtotal] = useState("");
  const [gst, setgst] = useState("");
  const [grandtotal, setgrandtotal] = useState("");
  const [applydiscount, setapplydiscount] = useState("");
  const [findata, setfinaldata] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserID(decoded.id);
    }
  }, [token]);

  useEffect(() => {
//    GetAdress();
  }, []);
  useEffect(() => {
    if (UserID) {
      Getcart();
      GetAdress();
    }
  }, [UserID]);

  
 const Getcart = async () => {
  try {
    const url = `${BASE_url}/api/shop/getcart/${UserID}`;
    const response = await axios.get(url);
    console.log("Response from API:", response.data);

    if (response.data && response.data.data) {
      const cartData = response.data.data;

      // Extracting necessary values from the response
      const { items, totals } = cartData;

      if (Array.isArray(items) && items.length > 0) {
        setCartItems(items); // Set cart items
        setsubtotal(totals.subtotalWithGst); 
        setfinaldata(totals);// Set subtotal with GST
        console.log("final data is",findata);
        console.log("Cart items set:", items);
        console.log("Subtotal (with GST):", totals.subtotalWithGst);
      } else {
        console.warn("No items found in the cart.");
        setCartItems([]);
      }
    } else {
      console.error("Invalid API response structure:", response.data);
      setCartItems([]);
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
};

  const updateCartQuantity = async (productId, quantity) => {
    try {
      const url = `${BASE_url}/api/shop/updatecart`;

      const requestBody = {
        userId: UserID,
        productId: productId,
        quantity: quantity,
      };

      const response = await axios.put(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Cart updated:", response.data);
      Getcart();
    } catch (error) {
      console.error("Error updating cart quantity", error);
      toast.error("Failed to update cart quantity");
    }
  };

  const Delcart = async (productId) => {
    try {
      const url = `${BASE_url}/api/shop/removecart`;
      const requestBody = {
        userId: UserID,
        productId: productId,
      };

      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Cart item removed:", response.data);
      toast.info("Item removed from cart");
      Getcart();
    } catch (error) {
      console.error("Error removing cart item", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const handleIncreaseQuantity = (item) => {
    updateCartQuantity(item.product._id, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateCartQuantity(item.product._id, item.quantity - 1);
    } else {
      Delcart(item.product._id);
    }
  };

  // Handle opening the modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Handle address submission
  const handleAddressSubmit = (e) => {
    e.preventDefault();

    Adddeliveryadress();
    handleCloseModal();
  };

  // -----------------------------------add address api-------------------
  const Adddeliveryadress = async () => {
    try {
      const url = `${BASE_url}/api/shop/deliveryaddress`;

      const requestBody = {
        consumerId: UserID,
        street: street,
        city: city,
        state: state,
        zipCode: zip,
        country: country,
        phone: phone,
      };

      const response = await axios.post(url, requestBody);
      console.log("response of address api", response);
    } catch (error) {
      console.log("Add address api ", error);
    }
  };

  // ------------------------------------------end----------------------
  const GetAdress = async () => {
    try {
      const url = `${BASE_url}/api/shop/alladdress/${UserID}`;

      const response = await axios.get(url);
      console.log("Response of get address", response);
      setAddresses(response.data.data);
    } catch (error) {
      console.log("Error in get address api", error);
    }
  };

  //  ------------------------------------end----------------------------------

  const Deladdress = async (addressId) => {
    try {
      console.log("Address ID is", addressId);
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });


      if (isConfirmed) {
        const url = `${BASE_url}/api/shop/deladdress/${addressId}`;
        const response = await axios.delete(url);
        console.log("Response of delete API", response);

      
        await GetAdress(); 
        // Show success message
        await Swal.fire(
          "Deleted!",
          "Your address has been deleted.",
          "success"
        );
      }
    } catch (error) {
      console.log("Error in delete API", error);
      // Show error message
      Swal.fire(
        "Error!",
        "There was a problem deleting your address.",
        "error"
      );
    }
  };

  // ----------------------------------apply coupon code-------------

  const Addcoupancode = async () => {
    try {
      const url = `${BASE_url}/api/shop/checkdiscount`;

      const requestBody = {
        userId: UserID,
        referralCode: refral,
        addressId: selectedAddressId,
      };

      const response = await axios.post(url, requestBody);
      console.log("Response of apply coupon ", response);

      const discountPercentage = response.data.data.discountPercentage;
      console.log("Discount Percentage", discountPercentage);

      const subtotalWithGs = parseFloat(findata.subtotalWithGst); 
      if (isNaN(subtotalWithGs)) {
        console.log("Invalid subtotal value.");
        return;
      }

      let totaldiscount = 0;
      let finalamount = subtotalWithGs;

      // Calculate the discount if a valid discount percentage is found
      if (discountPercentage) {
        totaldiscount = (discountPercentage * subtotalWithGs) / 100;
        finalamount = subtotalWithGs - totaldiscount;
        console.log("Discount applied, Grand Total: ", finalamount);
      } else {
        console.log("No discount applied, Subtotal: ", subtotalWithGs);
      }

      // Set state with the discount and grand total values
      setapplydiscount(totaldiscount);
      setgrandtotal(finalamount);
    } catch (error) {
      console.log("Error in add coupon code ", error);
    }
  };

  // -------------------------------------------order api------------------------
 const Doneorder = async (data) => {
    try {
      const url = `${BASE_url}/api/shop/doneorder`;
      console.log("razorpay id get in doneorder", data);

      const requestBody = {
        userId: UserID,
        referralCode: refral,
        addressId: selectedAddressId,
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
        totalAmount: applydiscount > 0 ? grandtotal : findata.subtotalWithGst,
        amountBeforeGst: findata.subtotalWithoutGst,
        amountAfterGst: findata.subtotalWithGst,
        discountAmount: applydiscount,
      };

      console.log("request body of doneorder", requestBody);
      const response = await axios.post(url, requestBody);
      console.log("Done order response", response);
      Getcart();

      if (response.data.message === "Order placed successfully!") {
        Swal.fire({
          title: "Order Successfully Placed!",
          html: `
            <p>Your order has been placed successfully.</p>
            <p><strong>Order ID:</strong> ${data.razorpay_order_id}</p>
            <p><strong>Payment ID:</strong> ${data.razorpay_payment_id}</p>
          `,
          icon: "success",
        }).then(() => {
          navigate("/invoice", { state: { orderData: response.data } });
          console.log("Order data is", response.data);
        });
      }
    } catch (error) {
      console.log("Error in order done API", error);
      toast.error("Failed to place order");
    }
  };

  // ----------------------------------
  const handleOpenRazorpay = (data) => {
    try {
      const options = {
        key: "rzp_test_mcwl3oaRQerrOW",
        amount: Number(data.amount) * 100,
        currency: "INR",
        name: "Kavagie Private Limited",
        description: "",
        order_id: data.id,
        handler: function (response) {
          // This function is called on successful payment
          console.log("Payment Successful:", response);
          setrazorpay_order_id(response.razorpay_order_id);
          setrazorpay_payment_id(response.razorpay_payment_id);
          setrazorpay_signature(response.razorpay_signature);

          // You can further handle the response here, if necessary
          Doneorder(response);
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error opening Razorpay:", error);
      throw error;
    }
  };

  // ------------------------------------

  const handlePayment = async () => {
    console.log("finalamount is final", grandtotal);
    try {
      const amountToSend = grandtotal;
      const _data = { TotalAmount: amountToSend.toFixed(2) };
      console.log("finalamount in handle payment", _data);
      const res = await axios.post(
        "https://login.enagickangenwater.org/api/payment/orders",
        _data
      );
      handleOpenRazorpay(res.data.data);
    } catch (error) {
      console.log("Error handling payment", error);
    }
  };
  // -------------------------------------------end----------------------------
  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-primary">View Cart</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="row d-flex justify-content-between">
              {/* Left Section */}
            <div className="col-lg-5">
  <table className="table">
    <thead>
      <tr>
        <th>Product</th>
        <th>Quantity</th>
        <th>Price (With GST)</th>
      </tr>
    </thead>
    <tbody>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <tr key={item.product._id}>
            <td>
              <div className="d-flex align-items-center">
                <img
                  src={`https://login.enagickangenwater.org/${item.product.image}`}
                  alt={item.product.name}
                  className="img-fluid"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    marginRight: "15px",
                  }}
                />
                <div>
                  <p className="mb-1">{item.product.name}</p>
                  <span
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => Delcart(item.product._id)}
                  >
                    <MdDeleteForever size={24} />
                  </span>
                </div>
              </div>
            </td>
            <td>
              <div className="input-group">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleDecreaseQuantity(item)}
                >
                  <FaMinus />
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value={item.quantity}
                  readOnly
                  style={{ maxWidth: "50px" }}
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleIncreaseQuantity(item)}
                >
                  <FaPlus />
                </button>
              </div>
            </td>
            <td>{item.priceWithoutGst.toFixed(2)}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="3" className="text-center">
            Your cart is empty.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

            <div
                className="col-lg-3"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                {/* Address List Section */}
                <h5 className="mb-3 mt-3 fw-bold" style={{ fontWeight: "600" }}>
                  Saved Address
                </h5>
                <ul className="list-group">
                  {addresses.length > 0 ? (
                    addresses.map((address) => (
                      <li
                        key={address._id}
                        className={`list-group-item d-flex justify-content-between align-items-center ${
                          selectedAddressId === address._id
                            ? "selected-address"
                            : ""
                        }`} // Add class for selected address
                        style={{
                          marginBottom: "15px",
                          position: "relative",
                          cursor: "pointer",
                          border:
                            selectedAddressId === address._id
                              ? "2px solid blue"
                              : "",
                        }} // Highlight border for selected address
                        onClick={() => setSelectedAddressId(address._id)} // Set selected address on click
                      >
                        {/* Checkbox at the top-right corner */}
                        <input
                          type="checkbox"
                          checked={selectedAddressId === address._id}
                          onChange={() => setSelectedAddressId(address._id)}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            cursor: "pointer",
                          }}
                        />

                        <div>
                          <strong>{address.recipientName}</strong>
                          <p style={{ margin: 0 }}>
                            {address.street}, {address.city}, {address.state},{" "}
                            {address.zipCode}, {address.country}
                          </p>
                          <p style={{ margin: 0 }}>{address.phone}</p>
                        </div>
                        <span
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent selecting the address when clicking delete
                            Deladdress(address._id);
                          }} // Handle address deletion
                        >
                          <MdDeleteForever size={20} />
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item text-center">
                      No addresses saved.
                    </li>
                  )}
                </ul>
                <div className="mb-3">
                  <Button variant="contained" onClick={handleOpenModal}>
                    Add New Address
                  </Button>
                </div>
              </div>
              {/* Right Section */}
              <div className="col-lg-4">
                <div className="card shadow-sm p-4">
                  {/* <div className="mb-3">
                    <Button variant="contained" onClick={handleOpenModal}>
                      Add Address
                    </Button>
                  </div> */}

                  <div className="mb-3">
                    <label
                      htmlFor="coupon"
                      className="form-label"
                      style={{ fontWeight: "bold" }}
                    >
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      id="coupon"
                      className="form-control"
                      placeholder="Enter Coupon Code"
                      onChange={(e) => setRefral(e.target.value)}
                    />
                    <button
                     className="btn btn-dark w-100 mt-2"
                     onClick={Addcoupancode}
                   >
                      Apply
                    </button>
                  </div>

                  <div className="card bg-light p-3">
                    <h5 className="font-weight-bold">Cart Total</h5>
                    <div className="d-flex justify-content-between">
                      <p>Cart Subtotal</p>
                      <p>Rs. {findata?.subtotalWithoutGst}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>GST</p>
                      <p>Rs. {findata?.gstTotal}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>Sub Total after GST</p>
                      <p>Rs. {findata.subtotalWithGst}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>Shipping</p>
                      <p>Free</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>Discount</p>
                      <p>Rs. {applydiscount}</p>
                    </div>

                    <hr />
                    <div className="d-flex justify-content-between font-weight-bold">
                      <p>Grand Total</p>
                      <p>
                        Rs.
                         {grandtotal
                          ? grandtotal.toFixed(2)
                          : findata.subtotalWithGst
                          ? (setgrandtotal(findata.subtotalWithGst),
                            findata.subtotalWithGst.toFixed(2))
                          : "0.00"}
                      </p>
                    </div>

                    <button
                      className="btn btn-primary w-100"
                      onClick={handlePayment} // Trigger Doneorder function
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add Address */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            padding: "20px",
            maxWidth: "500px",
            margin: "auto",
            marginTop: "100px",
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          <h2>Add Address</h2>
          <form onSubmit={handleAddressSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Street Address"
                  variant="outlined"
                  name="street"
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  variant="outlined"
                  name="city"
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  variant="outlined"
                  name="state"
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pin Code"
                  variant="outlined"
                  name="postalCode"
                  onChange={(e) => setZip(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  variant="outlined"
                  name="Country"
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone No"
                  variant="outlined"
                  name="Phone No."
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Grid>
            </Grid>
            <div className="mt-3">
              <Button variant="contained" color="primary" type="submit">
                Submit Address
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseModal}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default ALIviewcart;
