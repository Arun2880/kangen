import React, { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode";
import axios from 'axios';
import BASE_url  from "../../../config/constants.js";
const ConsumerHistory = () => {

    const token = sessionStorage.getItem('Token');
    //const BASE_URL = "http://localhost:5000";
    const [orders1, setOrders] = useState([]);
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
  
  return (
    <>
      <div className="right-content w-100">
        <div className="row dashboardBoxWrapperRow">
          <div className="col-md-12">
            <div className="section-heading mb-4 p-4">
              <h4 className="font-weight-bold text-primary">Your History</h4>
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
                    </tr>
                  </thead>
                  <tbody>
                    {orders1 && orders1.length > 0 ? (
                      orders1.map((order, index) => (
                        <tr key={order._id}>
                          <td>{index + 1}</td>
                          <td>
                            {order.items.map(item => item.product.name)}
                          </td>
                          <td>
                            {order.items.map(item => item.quantity).join(', ')}
                          </td>
                          <td>
                            {order.items.map(item => item.price).join(', ')}
                          </td>
                          <td>{order.discountApplied || '0'}</td>
                          <td>{order.totalAmount || '0'}</td>
                          <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">No Orders Found.</td>
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
  )
}

export default ConsumerHistory