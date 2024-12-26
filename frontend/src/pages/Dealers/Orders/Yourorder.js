import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa";
import { Button, TextField } from "@mui/material";
import BASE_url  from "../../../config/constants.js";

const Yourorder = () => {
  const token = sessionStorage.getItem("Token");
 // const BASE_url = "http://localhost:5000";
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [productNameFilter, setProductNameFilter] = useState("");

  useEffect(() => {
    GetOrderlist();
  }, []);

  const GetOrderlist = async () => {
    try {
      const url = `${BASE_url}/api/dealer/getorder`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      console.log("response of order api", response.data.data);
      setOrders(response.data.data);
    } catch (error) {
      console.log("Error in order list API", error);
    }
  };

  const handleFilterChange = () => {
    // Filters all orders based on the criteria provided
    const filteredOrders = orders.filter((order) => {
      const matchStartDate =
        startDateFilter === "" ||
        new Date(order.orderDate) >= new Date(startDateFilter);
      const matchEndDate =
        endDateFilter === "" ||
        new Date(order.orderDate) <= new Date(endDateFilter);
      const matchProductName =
        productNameFilter === "" ||
        order.items.some((item) =>
          item.productName
            .toLowerCase()
            .includes(productNameFilter.toLowerCase())
        );

      return matchStartDate && matchEndDate && matchProductName;
    });

    return filteredOrders;
  };

  const downloadExcel = () => {
    const filteredOrders = handleFilterChange(); // Get filtered orders based on all filters

    if (filteredOrders.length === 0) {
      alert("No orders to download!");
      return;
    }

    const data = filteredOrders.map((order, index) => ({
      "Sr. No": index + 1,
      "Order ID": order._id,
      "User ID": order.user,
      "User Type": order.userType,
      "Referral Code": order.referralCode,
      Status: order.status,
      "Order Date": new Date(order.orderDate).toLocaleString(),
      "Total Amount (After GST)": order.amountAfterGst,
      "Total Amount (Before GST)": order.amountBeforeGst,
      "Discount Amount": order.discountAmount,
      "Payment ID": order.razorpay_payment_id,
      "Payment Signature": order.razorpay_signature,
      "Delivery Address": `${order.address.street}, ${order.address.city}, ${
        order.address.state
      }, ${order.address.zip || "N/A"}`,
      "PDF Path": order.pdfPath,
      Products: order.items
        .map(
          (item) =>
            `${item.productName} (Qty: ${item.quantity}, Price: ${item.price})`
        )
        .join("; "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "Orders_Report.xlsx");
  };

  const filteredOrders = handleFilterChange();

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4 d-flex justify-content-between">
            <h4 className="font-weight-bold text-primary">
              Total Orders of your Referral Code List
            </h4>
            <Button variant="contained" color="primary" onClick={downloadExcel}>
              <FaDownload style={{ marginRight: "8px" }} />
              Download Report
            </Button>
          </div>
          {/* Filters in a single row */}
          <div className="mb-3 d-flex flex-wrap">
            
            <div className="mr-3">
              <TextField
                label="Start Date"
                variant="outlined"
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className="mr-3">
              <TextField
                label="End Date"
                variant="outlined"
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className="mr-3">
              <TextField
                label="Filter by Product Name"
                variant="outlined"
                value={productNameFilter}
                onChange={(e) => setProductNameFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="form-container bg-white p-4 shadow-sm">
            <div className="table-responsive">
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>Sr.No</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Discount</th>
                    <th>Purchase Price</th>
                    <th>Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr key={order._id}>
                        <td>{index + 1}</td>
                        <td>
                          {order.items
                            .map((item) => item.productName)
                            .join(", ")}
                        </td>
                        <td>
                          {order.items.map((item) => item.quantity).join(", ")}
                        </td>
                        <td>
                          {order.items.map((item) => item.price).join(", ")}
                        </td>
                        <td>{order.discountAmount || "0"}</td>
                        <td>{order.totalAmount || "0"}</td>
                        <td>
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No Orders Found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Yourorder;
