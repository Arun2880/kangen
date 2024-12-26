import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_url  from "../../config/constants.js";

const DealerOrder = () => {
  const token = sessionStorage.getItem("Token");
//const BASE_url = "http://localhost:5000";

  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Getdealerlist();
  }, []);

  const Getdealerlist = async () => {
    setLoading(true); 
    try {
      const url = `${BASE_url}/api/admin/dealers`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      setDealers(response.data.data[0]);
      setLoading(false); 
    } catch (error) {
      console.log("Error fetching dealers list: ", error);
      setError("Failed to fetch dealer list.");
      setLoading(false); 
    }
  };

  const handleDealerChange = (e) => {
    setSelectedDealer(e.target.value); 
    setOrders([]); 
    setError(null); 
  };

  const handleViewOrders = async () => {
    if (!selectedDealer) return;

    setLoadingOrders(true); 
    try {
      const url = `${BASE_url}/api/admin/dealerorder/${selectedDealer}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      console.log("response of orders api", response);
      setOrders(response.data.orders); 
      setLoadingOrders(false); 
    } catch (error) {
      console.log("Error fetching dealer orders: ", error);
      setError("Failed to fetch dealer orders.");
      setLoadingOrders(false); 
    }
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-primary">Dealer Orders</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="row d-flex justify-content-around">
              <div className="col-md-8">
                <div className="form-group">
                  <label htmlFor="clientDropdown">Select dealer to see orders</label>

                  {loading ? (
                    <div className="mt-3">
                      <span>Loading dealers...</span>
                    </div>
                  ) : (
                    <select
                      id="clientDropdown"
                      className="form-control mt-3"
                      value={selectedDealer} 
                      onChange={handleDealerChange}
                    >
                      <option value="">--Select Dealer--</option>
                      {dealers.map((dealer) => (
                        <option key={dealer._id} value={dealer._id}>
                          {dealer.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* {error && <p className="text-danger mt-2">{error}</p>} */}
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group">
                  <button
                    className="mt-5 px-4 py-2 btn btn-primary"
                    onClick={handleViewOrders} 
                    disabled={!selectedDealer || loadingOrders}
                  >
                    {loadingOrders ? 'Loading Orders...' : 'View Orders'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}

          <div className="form-container bg-white p-4 shadow-sm ">
            <div className="section-heading p-2 mb-4">
              <h5 className="font-weight-bold">Consumer List</h5>
            </div>
            <div className="row">
              <div className="col-md-12">
                {orders.length > 0 ? (
                  <div className="mt-5">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Items</th>
                          <th>Total Amount</th>
                          <th>Order Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>
                              <ul>
                                {order.items.map((item, index) => (
                                  <li key={index}>
                                    <strong>Product Name:</strong> {item.product.name} <br />
                                    <strong>Quantity:</strong> {item.quantity} <br />
                                    <strong>Price:</strong> {item.price}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td>{order.totalAmount}</td>
                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td>{order.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  !loadingOrders && selectedDealer && (
                    <div className="mt-3">No orders found for this dealer.</div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerOrder;
