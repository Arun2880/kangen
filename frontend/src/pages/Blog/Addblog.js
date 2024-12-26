import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import BASE_url  from "../../config/constants.js";


const Addblog = () => {
  const token = sessionStorage.getItem("Token");
  //const BASE_url = "http://localhost:5000";

  const [title1, setTitle1] = useState(""); 
  const [details1, setDetails1] = useState(""); 
  const [title2, setTitle2] = useState(""); 
  const [details2, setDetails2] = useState(""); 
  const [details3, setDetails3] = useState(""); 
  const [image, setImage] = useState(null); 

  // ------------------------------Add blog------------------

  const navigate=useNavigate();
  const Blogapi = async () => {
    try {
      const url = `${BASE_url}/api/blog/addblog`;

      const formData = new FormData();
      formData.append("title1", title1);
      formData.append("deatils1", details1);
      formData.append("title2", title2);
      formData.append("deatils2", details2);
      formData.append("deatils3", details3);
      formData.append("image", image);

      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(url, formData, { headers });
      console.log("Blog added successfully", response);

      Swal.fire("Success!", "Blog added successfully", "success");
      navigate('/viewblog');
    } catch (error) {
      console.log("Error in Add blog API", error);
      Swal.fire("Error!", "Failed to add blog", "error");
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); 
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-primary">Add Blog</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>First Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter First Title"
                    onChange={(e) => setTitle1(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Main Page Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Second Title"
                    onChange={(e) => setTitle2(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Short Home Details</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter Short Home Details"
                    onChange={(e) => setDetails1(e.target.value)}
                    rows="3"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Second Main Content</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter Second Main Content"
                    onChange={(e) => setDetails2(e.target.value)}
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Third Main Content</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter Third Main Content"
                    onChange={(e) => setDetails3(e.target.value)}
                    rows="3"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Product Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
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
                  onClick={Blogapi}
                >
                  Add Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addblog;
