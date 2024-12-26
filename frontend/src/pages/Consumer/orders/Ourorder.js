import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_url  from "../../../config/constants.js";
const Ourorder = () => {
    const token = sessionStorage.getItem('Token');
    //const BASE_url = "http://localhost:5000";
    const [orders, setOrders] = useState([]);
  
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
    }
  return (
    <div className="right-content w-100">
    <div className="row dashboardBoxWrapperRow">
      <div className="col-md-12">
        <div className="section-heading mb-4 p-4">
          <h4 className="font-weight-bold text-primary">Total Orders of your Refral code List</h4>
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
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order.items.map(item => item.product.name).join(', ')}</td>
                      <td>{order.items.map(item => item.quantity).join(', ')}</td>
                      <td>{order.items.map(item => item.price).join(', ')}</td>
                      <td>{order.discountApplied || 'N/A'}</td>
                      <td>{order.totalAmount || 'N/A'}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>

                      {/* <td>
                        <button className="btn btn-primary btn-sm">View</button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No Orders Found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Ourorder