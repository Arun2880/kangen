import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; 

const Addstock = () => {

  let BASE_URL="http://localhost:5000";
  const [proid, setproid] = useState("");
  const [proname, setproname] = useState("");
  const [proquantity, setproquantity] = useState("");
  const [proprice, setproprice] = useState("");

  const navigate = useNavigate();

  const Addstockapi = async (event) => {
    event.preventDefault(); 

    try {
      const url = `${BASE_URL}/erika/addstock`; 

      const requestBody = {
        product_id: proid,
        product_name: proname,
        product_quantity: parseFloat(proquantity),
        product_price_unit: parseFloat(proprice),
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.post(url, requestBody, { headers });
      console.log("response of Add stock API", response);

   
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Product added successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/viewstock"); 
        });
      }
    } catch (error) {
      console.error("Error occurred while adding stock", error);

    
      Swal.fire({
        title: "Error!",
        text: "Failed to add product. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-primary">Add Stocks</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <form onSubmit={Addstockapi}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="productID">Product ID</label>
                    <input
                      type="text"
                      id="productID"
                      className="form-control"
                      placeholder="Enter product id"
                      onChange={(e) => setproid(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="productName">Product Name</label>
                    <input
                      type="text"
                      id="productName"
                      className="form-control"
                      placeholder="Enter product name"
                      onChange={(e) => setproname(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="productQuantity">Product Quantity</label>
                    <input
                      type="number" 
                      id="productQuantity"
                      className="form-control"
                      placeholder="Enter product quantity"
                    
                      onChange={(e) => setproquantity(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="productPrice">Product Price</label>
                    <input
                      type="number" 
                      id="productPrice"
                      className="form-control"
                      placeholder="Enter product price"

                      onChange={(e) => setproprice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 d-flex justify-content-end">
                  <button type="button" className="btn btn-danger mr-4">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary mr-2">
                    Add Stock
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

export default Addstock;
