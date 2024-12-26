import React, { useState } from "react";
import "../../assests/css/comman.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_url from '../../config/constants.js';

const AddClient = () => {
  const token = sessionStorage.getItem('Token');
  console.log("token is ", token);

  const navigate=useNavigate();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [discount, setDiscount] = useState("");

  const Registerdealer = async (e) => {
    e.preventDefault(); 

    try {
      const url = `https://login.enagickangenwater.org/api/auth/register/dealer`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const requestBody = {
        name: username,
        email: email,
        password: password,
        discount: discount,
      };

      const response = await axios.post(url, requestBody, { headers });

      console.log("response of register dealer", response);

      if (response.data.message === "Dealer registered successfully") {
    
        Swal.fire({
          title: "Good job!",
          text: "Dealer Registered Successfully.",
          icon: "success"
        });

        navigate("/viewdealer");
      }

    } catch (error) {
      console.log("Error in Register dealer API ", error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong! Please try again.',
      });
    }
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-primary">Add Dealer</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <form onSubmit={Registerdealer}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="dealerName">Dealer Name</label>
                    <input
                      type="text"
                      id="dealerName"
                      className="form-control"
                      placeholder="Enter Dealer Name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="dealerEmail">Email</label>
                    <input
                      type="email"
                      id="dealerEmail"
                      className="form-control"
                      placeholder="Enter Dealer Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="dealerPassword">Password</label>
                    <input
                      type="text"
                      id="dealerPassword"
                      className="form-control"
                      placeholder="Enter Dealer Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="dealerDiscount">Discount (%)</label>
                    <input
                      type="text"
                      id="dealerDiscount"
                      className="form-control"
                      placeholder="Enter Discount"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 d-flex justify-content-end">
                  <button type="button" className="btn btn-danger mr-4">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary mr-2"
                  >
                    Register
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClient;
