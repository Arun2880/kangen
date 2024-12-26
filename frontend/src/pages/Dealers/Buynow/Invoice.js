import React from "react";
import { useLocation } from "react-router-dom";
import { FaFileDownload } from "react-icons/fa";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import "./invoice.css";

const Invoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

 console.log("order data in invoice",orderData);
  if (!orderData || !orderData.data) {
    return <div className="no-data">No order data available</div>;
  }

  
  const { user, order, pdfPath } = orderData.data;
  const items = order.items; 

  const gotodashboard = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={gotodashboard}
        className="back-button"
      >
        Back
      </Button>

      <div
        className="invoice-container"
        style={{ border: "2px solid blue", padding: "" }}
      >


        <div className="header-container">
          <h2 className="invoice-title" style={{ marginTop: "-10px" }}>
            <u>Bill Invoice</u>
          </h2>
          
        </div>
         <div
          className="company-details"
          style={{ borderBottom: "2px solid black" }}
        >
          <h3 style={{ fontWeight: "bold" }}>Kavagie Private Limited</h3>

          <p style={{ fontWeight: "bold" }}>
            {" "}
            900/2 Indra Nagar ITBP, Dehradun, Uttrakhand-248006
          </p>
          <p style={{ fontWeight: "bold" }}>
            {" "}
            support@enagickangenwater.org , +91-7535970257
          </p>
        </div>

        <div className="details-container">
          <div className="customer-details">
            <h3>Customer Details</h3>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {order.address.phone}
            </p>
            <p>
              <strong>Address:</strong> {order.address.street},{" "}
              {order.address.city}, {order.address.state},{" "}
              {order.address.postalCode}, {order.address.country}
            </p>
          </div>

          <div className="order-details">
            <h3>Order Details</h3>
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.orderDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Razorpay ID:</strong> {order.razorpay_payment_id}
            </p>
          </div>
        </div>
        <hr />
        <div className="order-items">
          <h3 style={{ fontWeight: "bold" }}>Products Ordered</h3>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Image</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>
                  <td>
                    <img
                      src={`https://login.enagickangenwater.org/${item.productImage}`}
                      alt={item.productName}
                      className="product-image"
                      style={{ height: "50px", width: "50px" }}
                    />
                  </td>
                  <td>Rs {item.price}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr />
        <div className="order-summary">
          <div className="order-summary-item">
            <span className="order-summary-label">Total Before GST:</span>
            <span className="order-summary-value">
              Rs. {order.amountBeforeGst}
            </span>
          </div>
          <div className="order-summary-item">
            <span className="order-summary-label">GST Amount:</span>
            <span className="order-summary-value">
              Rs. {(order.amountAfterGst - order.amountBeforeGst).toFixed(2)}
            </span>
          </div>
          <div className="order-summary-item">
            <span className="order-summary-label">Discount Amount:</span>
            <span className="order-summary-value">
              Rs. {order.discountAmount || 0}
            </span>
          </div>

          <div
            className="order-summary-item"
            style={{
              borderBottom: "2px solid black",
              borderTop: "2px solid black",
              marginTop:"15px"
            }}
          >
            <span className="order-summary-label" style={{padding:"10px 0"}}>Total Amount:</span>
            <span className="order-summary-value" style={{padding:"10px 0"}}>Rs. {order.totalAmount}</span>
          </div>
        </div>

        <div className="download-section">
          <a href={pdfPath} download>
            <button className="download-btn">
              <FaFileDownload className="download-icon" /> Download Invoice
            </button>
          </a>
        </div>

  
        <div className="terms-conditions">
          <h3>Terms and Conditions</h3>
          <ul>
            <li>All payments are due within 30 days from the invoice date.</li>
            <li>
              Goods once sold cannot be returned unless damaged during shipping.
            </li>
            <li>
              Late payments will incur a 5% late fee for every 15 days overdue.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Invoice;
