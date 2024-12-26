import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Button from "@mui/material/Button";
import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import BASE_url  from "../../../config/constants.js";

const History = () => {
  const token = sessionStorage.getItem("Token");
  //const BASE_URL = "http://localhost:5000";
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      console.log("id", decoded);
      setUserId(decoded.id);
    }
    if (userId) {
      GetOrderHistory();
    }
  }, [token, userId]);

  const GetOrderHistory = async () => {
    try {
      const url = `${BASE_url}/api/shop/gethistory/${userId}`;
      const response = await axios.get(url);
      console.log("Response of history API", response.data);
      setOrders(response.data.orders);
    } catch (error) {
      console.log("Error in order list API", error);
    }
  };

  const handleDownloadPDF = (pdfPath) => {
    const fullPath = `${BASE_url}/${pdfPath}`;
    window.open(fullPath, "_blank");
  };

  const downloadExcelReport = () => {
    if (orders.length === 0) {
      alert("No orders to download!");
      return;
    }

    const data = orders.map((order, index) => ({
      "Sr. No": index + 1,
      "Product Name": order.items.map((item) => item.product.name).join(", "),
      Quantity: order.items.map((item) => item.quantity).join(", "),
      "Price Per Item": order.items.map((item) => item.price).join(", "),
      Discount: order.discountAmount || "0",
      "Total Amount": order.totalAmount || "0",
      "Order Date": new Date(order.orderDate).toLocaleString(),
      "PDF Path": order.pdfPath,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order History");

    XLSX.writeFile(workbook, "Order_History_Report.xlsx");
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="row dashboardBoxWrapperRow">
          <div className="col-md-12">
            <div className="section-heading mb-4 p-4 d-flex justify-content-between">
              <h4 className="font-weight-bold text-primary">Your History</h4>
              <Button
                variant="contained"
                color="primary"
                onClick={downloadExcelReport}
              >
                <FaDownload style={{ marginRight: "8px" }} />
                Download Report
              </Button>
            </div>

            <div className="form-container bg-white p-4 shadow-sm">
              <div className="table-responsive">
                <table className="table table-bordered v-align">
                  <thead className="thead-dark">
                    <tr>
                      <th>Sr.No</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Price Per Item</th>
                      <th>Discount</th>
                      <th>Total Amount</th>
                      <th>Order Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders && orders.length > 0 ? (
                      orders.map((order, index) => (
                        <tr key={order._id}>
                          <td>{index + 1}</td>
                          <td>
                            {order.items
                              .map((item) => item.product.name)
                              .join(", ")}
                          </td>
                          <td>
                            {order.items
                              .map((item) => item.quantity)
                              .join(", ")}
                          </td>
                          <td>
                            {order.items.map((item) => item.price).join(", ")}
                          </td>
                          <td>{order.discountAmount || "0"}</td>
                          <td>{order.totalAmount || "0"}</td>
                          <td>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                          <td>
                            <Button
                              className="error"
                              color="error"
                              style={{
                                backgroundColor: "rgba(241,17,51,0.2)",
                              }}
                              onClick={() => handleDownloadPDF(order.pdfPath)}
                            >
                              <FaDownload />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
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
    </>
  );
};

export default History;
