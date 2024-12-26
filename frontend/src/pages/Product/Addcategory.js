import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import BASE_url  from "../../config/constants.js";

const Addcategory = () => {
  const [name, setName] = useState(""); 

  const token = sessionStorage.getItem("Token");
 // const BASE_url = "http://localhost:5000";

  const navigate = useNavigate();
  const Makecategory = async (e) => {
    e.preventDefault();
    try {
      const url = `${BASE_url}/api/admin/addcategory`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const requestBody = {
        name: name, 
      };

      const response = await axios.post(url, requestBody, { headers });

      console.log("Response of add category", response);

      const setmessage = response?.data?.message; 
      console.log("setmessage", setmessage);

      if (setmessage === "Category created") {
        Swal.fire({
          title: "Good job!",
          text: "Category created successfully.",
          icon: "success",
        });

        navigate("/viewcategory");
      } else {
        Swal.fire({
          title: "Error!",
          text: setmessage || "Something went wrong.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error in create category API", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to create category.",
        icon: "error",
      });
    }
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-primary">Add Category</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Category Name"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
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
                  onClick={Makecategory}
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addcategory;
