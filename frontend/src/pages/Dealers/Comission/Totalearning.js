import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import BASE_url  from "../../../config/constants.js";

const Totalearning = () => {
  const token = sessionStorage.getItem("Token");
  //const BASE_url = "http://localhost:5000";

  const [userId, setUserId] = useState("");
  const [orders, setOrders] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      console.log("id", decoded);
      setUserId(decoded.id);
    }
  }, [token]);

  useEffect(() => {
    if (userId) {
      Getearning();
    }
  }, [userId]);

  const Getearning = async () => {
    try {
      const url = `${BASE_url}/api/dealer/earncommission/${userId}`;
      const response = await axios.get(url);
      console.log("response of earning api", response);

      // Extracting orders and total commission
      const { data } = response.data;
      const { consumers, totalCommission } = data;

      // Set total earnings
      setTotalEarnings(totalCommission);

      // Collecting all orders from consumers
      const allOrders = consumers.reduce((acc, consumer) => {
        return [...acc, ...consumer.orders]; // Flatten the orders array
      }, []);
      setOrders(allOrders); // Set the orders in state
    } catch (error) {
      console.log("Error in earning API", error);
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="row dashboardBoxWrapperRow">
          <div className="col-md-12">
            <div className="section-heading mb-4 p-4">
              <h4 className="font-weight-bold text-primary">Your Earning</h4>
            </div>

            <div className="form-container bg-white p-4 shadow-sm">
              <div className="table-responsive">
                <table className="table table-bordered v-align">
                  <thead className="thead-dark">
                    <tr>
                      <th>Sr.No</th>
                      <th>Order ID</th>
                      <th>Discount</th>
                      <th>Total Amount</th>
                      <th>Order Earning</th>
                      <th>Order Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders && orders.length > 0 ? (
                      orders.map((order, index) => (
                        <tr key={order._id}>
                          <td>{index + 1}</td>
                          <td>{order._id}</td> {/* Displaying the Order ID */}
                          <td>{order.discountAmount || "0"}</td>
                          <td>{order.totalAmount || "0"}</td>
                          <td>{order.dealerCommission || "0"}</td>{" "}
                          {/* Displaying total dealer commission */}
                          <td>
                            {new Date(order.orderDate).toLocaleDateString()}
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
                <div className="total-earning">
                  <h5 className="text-primary">
                    Total Earnings: ₹ {totalEarnings}{" "}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Totalearning;
