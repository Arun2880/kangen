import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Button from "@mui/material/Button";
import { FaDownload } from "react-icons/fa";
import BASE_url  from "../../../config/constants.js";

const Consumersorder = () => {
  const token = sessionStorage.getItem("Token");
 // const BASE_url = "http://localhost:5000";

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    productName: "",
  });

  useEffect(() => {
    Getorder();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, filters]);

  const Getorder = async () => {
    try {
      const url = `${BASE_url}/api/dealer/allorders`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      console.log("response of get orders", response.data.data);
      setOrders(response.data.data);
    } catch (error) {
      console.log("Get Order API error", error);
    }
  };

  const filterOrders = () => {
    let tempOrders = [...orders];
    const { startDate, endDate, productName } = filters;

    if (startDate) {
      tempOrders = tempOrders.filter((order) => {
        return new Date(order.orderDate) >= new Date(startDate);
      });
    }

    if (endDate) {
      tempOrders = tempOrders.filter((order) => {
        return new Date(order.orderDate) <= new Date(endDate);
      });
    }

    if (productName) {
      tempOrders = tempOrders.filter((order) => {
        return order.items.some((item) =>
          item.product.name.toLowerCase().includes(productName.toLowerCase())
        );
      });
    }

    setFilteredOrders(tempOrders);
  };

  // Function to download orders as an Excel file
  const downloadExcel = () => {
    const exportData = filteredOrders.map((order) => ({
      OrderID: order._id,
      User: order.user,
      UserType: order.userType,
      AddressStreet: order.address?.street || "N/A",
      AddressCity: order.address?.city || "N/A",
      AddressState: order.address?.state || "N/A",
      AddressCountry: order.address?.country || "N/A",
      AddressPostalCode: order.address?.postalCode || "N/A",
      Phone: order.address?.phone || "N/A",
      AmountAfterGst: order.amountAfterGst || "0",
      AmountBeforeGst: order.amountBeforeGst || "0",
      DiscountAmount: order.discountAmount || "0",
      TotalAmount: order.amountAfterGst || "0",
      OrderDate: new Date(order.orderDate).toLocaleDateString(),
      Status: order.status || "N/A",
      RazorpayOrderID: order.razorpay_order_id || "N/A",
      RazorpayPaymentID: order.razorpay_payment_id || "N/A",
      RazorpaySignature: order.razorpay_signature || "N/A",
      ReferralCode: order.referralCode || "N/A",
      PDFPath: order.pdfPath || "N/A",
      Items: order.items
        .map(
          (item) =>
            `${item.product.name} (Qty: ${item.quantity}, Price: ${item.price})`
        )
        .join(", "),
    }));

    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Create a workbook with the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Write the workbook to a file and trigger a download
    XLSX.writeFile(wb, "Orders_Report.xlsx");
  };

  const handleDownload = (pdfPath) => {
    const fullPath = `${BASE_url}/${pdfPath}`;
    window.open(fullPath, "_blank");
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4 d-flex justify-content-between align-items-center">
            <h4 className="font-weight-bold text-primary">
              Total Added Category List
            </h4>
            <Button variant="contained" color="primary" onClick={downloadExcel}>
              Download Report
            </Button>
          </div>

          {/* Filters Section */}
          <div className="filter-section mb-4">
            <div className="form-row">
              <div className="form-group col-md-3">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="form-control"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="form-control"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="productName">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  className="form-control"
                  value={filters.productName}
                  onChange={handleFilterChange}
                  placeholder="Search by Product Name"
                />
              </div>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders && filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr key={order._id}>
                        <td>{index + 1}</td>
                        <td>
                          {order.items
                            .map((item) => item.product.name)
                            .join(", ")}
                        </td>
                        <td>
                          {order.items.map((item) => item.quantity).join(", ")}
                        </td>
                        <td>
                          {order.items.map((item) => item.price).join(", ")}
                        </td>
                        <td>
                          {order.discountAmount ? order.discountAmount : 0}
                        </td>
                        <td>{order.amountAfterGst || "N/A"}</td>
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
                            onClick={() => handleDownload(order.pdfPath)}
                          >
                            <FaDownload />
                          </Button>
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

export default Consumersorder;
