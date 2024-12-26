import React, { useEffect, useState } from "react";
import "../../assests/css/comman.css";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import BASE_url  from "../../config/constants.js";
import {
  Button,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const Viewblogs = () => {
  const token = sessionStorage.getItem("Token");
  //const BASE_URL1 = "http://localhost:5000";
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllblogs();
  }, []);

  // Fetch all blogs
  const getAllblogs = async () => {
    try {
      const url = `${BASE_url}/api/blog/bloglist`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.get(url, { headers });
      console.log("All blog list data:", response.data);
      setProducts(response.data.data); 
    } catch (error) {
      console.error("Error get blog connecting to API", error);
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const url = `${BASE_url}/api/blog/delblog/${id}`;
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };


        await axios.delete(url, { headers });
        Swal.fire('Deleted!', 'Your blog has been deleted.', 'success');
        
 
        getAllblogs();
      } catch (error) {
        console.error("Error deleting blog", error);
        Swal.fire('Error!', 'There was an error deleting the blog.', 'error');
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-primary">Blog</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="table-responsive">
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>Sr.No</th>
                    <th>Blog Image & Title</th>
                    <th>Second Title</th>
                    <th>Upload Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product, index) => (
                      <tr key={product._id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={`https://login.enagickangenwater.org/images/${product.image}`}
                              alt={product.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                marginRight: "10px",
                              }}
                            />
                            <span>{product.title1}</span>
                          </div>
                        </td>
                        <td>{product.title2}</td>
                        <td>{formatDate(product.date)}</td> {/* Format date */}
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Button
                              className="error"
                              color="error"
                              onClick={() => handleDelete(product._id)} 
                              style={{
                                backgroundColor: "rgba(241,17,51,0.2)",
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewblogs;
