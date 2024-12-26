import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import BASE_url  from "../../config/constants.js";
const Dealersearning = () => {
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(""); 
  const [consumers, setConsumers] = useState([]); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [loadingConsumers, setLoadingConsumers] = useState(false); 
  const [totalearning, setTotalearnning] = useState("");

  const token = sessionStorage.getItem("Token");
  const navigate = useNavigate();
//  const BASE_url = "http://localhost:5000";

  useEffect(() => {
    if (!token) {
     
      navigate("/login");
    } else {
      Getdealerlist();
    }
  }, [token, navigate]);

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
      const dealerData = response.data.data[0];
      setDealers(dealerData); 
      setLoading(false); 
    } catch (error) {
      console.log("Error fetching dealers list: ", error);
      setError("Failed to fetch dealer list.");
      setLoading(false); 
    }
  };

  
  const handleDealerChange = (e) => {
    setSelectedDealer(e.target.value);
  };

  
  const handleViewConsumers = async () => {
    if (!selectedDealer) {
      setError("Please select a dealer first.");
      return;
    }
    setError(null);
    setLoadingConsumers(true);

    try {
      const url = `${BASE_url}/api/dealer/earncommission/${selectedDealer}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      console.log("response of earning api", response);
      setConsumers(response.data.data.consumers);
      setLoadingConsumers(false);
      setTotalearnning(response.data.data.totalCommission);
    } catch (error) {
      console.log("Error fetching consumers: ", error);
      setError("Failed to fetch consumers.");
      setLoadingConsumers(false);
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="row dashboardBoxWrapperRow">
          <div className="col-md-12">
            <div className="section-heading mb-4 p-4">
              <h4 className="font-weight-bold text-primary">
                View Consumers Registered by Dealer
              </h4>
            </div>

            <div className="form-container bg-white p-4 shadow-sm">
              <div className="row d-flex justify-content-around">
                <div className="col-md-8">
                  <div className="form-group">
                    <label htmlFor="clientDropdown">
                      If the Dealer is already added, please select from the
                      dropdown
                    </label>

                    {loading ? (
                      <div className="mt-3">
                        <CircularProgress />
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
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <Button
                      className="mt-5 px-4 py-2"
                      variant="contained"
                      onClick={handleViewConsumers} 
                      disabled={loadingConsumers} 
                    >
                      {loadingConsumers ? (
                        <CircularProgress size={24} />
                      ) : (
                        "View Consumers"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>

        {/* Display consumers */}
        <div className="form-container bg-white p-4 shadow-sm ">
          <div className="section-heading p-2 mb-4">
            <h5 className="font-weight-bold">Order List</h5>
          </div>
          <div className="row">
            {loadingConsumers ? (
              <div className="d-flex justify-content-center">
                <CircularProgress />
              </div>
            ) : consumers && consumers.length > 0 ? (
              <>
                <table className="table table-bordered v-align">
                  <thead>
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
                    {consumers.map((consumer, index) =>
                      consumer.orders.map((order, orderIndex) => (
                        <tr key={`${index}-${orderIndex}`}>
                          <td>{index + 1}</td>
                          <td>{order._id}</td>
                          <td>{order.discountAmount || "0"}</td>
                          <td>{order.totalAmount}</td>
                          <td>{order.dealerCommission || "0"}</td>
                          <td>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Total Earnings Heading */}
                <div className="mt-4">
                  <h5 className="font-weight-bold">
                    Total Earnings: ₹ {totalearning}
                  </h5>
                </div>
              </>
            ) : (
              <p>No consumers found for this dealer.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dealersearning;
