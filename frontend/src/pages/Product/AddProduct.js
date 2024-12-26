import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import BASE_url  from "../../config/constants.js";

const AddProduct = () => {
  const token = sessionStorage.getItem("Token");
  //const BASE_url = "http://localhost:5000";

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sellprice, setSellprice] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [discription, setDes] = useState("");
  const [gstpercent, setgstpercent] = useState("");

  useEffect(() => {
    Getcategory();
  }, []);

  const Getcategory = async () => {
    try {
      const url = `${BASE_url}/api/admin/getcategory`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      console.log("response of get category", response.data);

      setCategories(response.data.data);
    } catch (error) {
      console.log("Error in get category api", error);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // ------------------------------Add product------------------

  const Productapi = async () => {
    try {
      const url = `${BASE_url}/api/admin/addproduct`;

      // const formData = new FormData();
      // formData.append("name", name);
      // formData.append("price", price);
      // formData.append("sellprice", sellprice);
      // formData.append("category", selectedCategory);
      // formData.append("brand", brand);
      // formData.append("stock", stock);
      // formData.append("image", image);
      // formData.append("discription", discription);
      // formData.append("gstpercent", gstpercent);

const requestBody={
      name: name,
      image:image,
      discription: discription,
      price: price,
      sellprice: sellprice,
      category:selectedCategory ,
      brand: brand,
      stock: stock,
      gst:parseInt(gstpercent)
}

      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      console.log("Form data is", requestBody);
      const response = await axios.post(url, requestBody, { headers });
      console.log("Product added successfully", response);
      Swal.fire("Success!", "Product added successfully", "success");
    } catch (error) {
      if (error.response) {
        // Server-side error
        console.log("Server error response:", error.response.data);
        Swal.fire(
          "Error!",
          `Failed to add product: ${error.response.data.message}`,
          "error"
        );
      } else if (error.request) {
        // Network error
        console.log("Network error:", error.request);
        Swal.fire("Error!", "Network error. Please try again.", "error");
      } else {
        // Other errors
        console.log("Error", error.message);
        Swal.fire("Error!", `Failed to add product: ${error.message}`, "error");
      }
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
            <h4 className="font-weight-bold text-primary">Add Product</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Product Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select Category</option>
                    {categories.length > 0 &&
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Product Brand"
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>GST ( % )</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter GST % of Product"
                    onChange={(e) => setgstpercent(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Product Price"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Sell Price</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Sell Price"
                    onChange={(e) => setSellprice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Stock Quantity"
                    onChange={(e) => setStock(e.target.value)}
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
              <div className="col-md-12">
                <div className="form-group">
                  <label>Product Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter Product Description"
                    onChange={(e) => setDes(e.target.value)}
                    rows="3"
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
                  onClick={Productapi} // Trigger product API on button click
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
