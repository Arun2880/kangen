import React, { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from "@mui/material/CircularProgress";
import BASE_url  from "../../config/constants.js";

const Getconsumerbydealer = () => {
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(""); // To track selected dealer
  const [consumers, setConsumers] = useState([]); // To store fetched consumers
  const [error, setError] = useState(null); // Error handling state
  const [loading, setLoading] = useState(false); // Loading state for dealers
  const [loadingConsumers, setLoadingConsumers] = useState(false); // Loading state for consumers

  const token = sessionStorage.getItem("Token");
  const navigate = useNavigate();
 // const BASE_url = "http://localhost:5000";

  useEffect(() => {
    if (!token) {
      // If the token is missing, redirect to login
      navigate('/login');
    } else {
      Getdealerlist();
    }
  }, [token, navigate]);

  const Getdealerlist = async () => {
    setLoading(true); // Start loader
    try {
      const url = `${BASE_url}/api/admin/dealers`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      const dealerData = response.data.data[0];
      setDealers(dealerData); // Set the dealers data
      setLoading(false); // Stop loader
    } catch (error) {
      console.log("Error fetching dealers list: ", error);
      setError("Failed to fetch dealer list.");
      setLoading(false); // Stop loader
    }
  };

  // Handle dropdown change to capture selected dealer
  const handleDealerChange = (e) => {
    setSelectedDealer(e.target.value);
    setConsumers([]); // Reset consumers when dealer is changed
  };

  // Fetch consumers registered by the selected dealer
  const handleViewConsumers = async () => {
    if (!selectedDealer) {
      setError("Please select a dealer first.");
      return;
    }
    setError(null); // Clear previous error
    setLoadingConsumers(true); // Start consumer loading

    try {
      const url = `${BASE_url}/api/admin/getconsumerusedealer/${selectedDealer}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      console.log("response of consumer data",response);
      setConsumers(response.data.data || []); // Set consumers data or empty array if no data
      setLoadingConsumers(false); // Stop loading consumers
    } catch (error) {
      console.log("Error fetching consumers: ", error);
      setError("Failed to fetch consumers.");
      setLoadingConsumers(false); // Stop loading consumers
    }
  };

  return (
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
                      value={selectedDealer} // Bind selectedDealer to dropdown
                      onChange={handleDealerChange} // Capture dropdown change
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
                    onClick={handleViewConsumers} // Trigger fetching consumers
                    disabled={loadingConsumers} // Disable button while loading consumers
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
          {/* {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )} */}
        </div>
      </div>

      {/* Display consumers */}
      <div className="form-container bg-white p-4 shadow-sm ">
        <div className="section-heading p-2 mb-4">
          <h5 className="font-weight-bold">Consumer List</h5>
        </div>
        <div className="row">
          {loadingConsumers ? (
            <div className="d-flex justify-content-center">
              <CircularProgress />
            </div>
          ) : consumers.length > 0 ? (
            <table className="table table-bordered v-align">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th> Consumer Name</th>
                  <th>Consumer Email</th>
                  <th>Consumer Refral Code</th>
                  <th>Discount</th>
                </tr>
              </thead>
              <tbody>
                {consumers.map((consumer, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{consumer.name}</td>
                    <td>{consumer.email}</td>
                    <td>{consumer.referralCode}</td>
                    <td>{consumer.discount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No consumers found for this dealer.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Getconsumerbydealer;
