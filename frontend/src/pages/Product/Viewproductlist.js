import React, { useEffect, useState } from "react";
import "../../assests/css/comman.css";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const Viewproductlist = () => {
  const token = sessionStorage.getItem("Token");
  const BASE_URL1 = "https://login.enagickangenwater.org/api/admin";
  const [products, setProducts] = useState([]);

  // State for modal
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getAllProducts();
  }, []);

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const url = `${BASE_URL1}/productlist`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.get(url, { headers });
      console.log("All product list data:", response.data);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error connecting to API", error);
    }
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    console.log("Deleting product with id:", productId);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const url = `${BASE_URL1}/delproduct/${productId}`;
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };
        await axios.delete(url, { headers });
        getAllProducts(); // Refresh product list
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire(
          "Error!",
          "There was an error deleting the product.",
          "error"
        );
      }
    }
  };

  // Handle open modal for editing
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  // Handle modal close
  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  // Handle update product
  const handleUpdate = async () => {
    try {
      const url = `${BASE_URL1}/updatepro/${selectedProduct._id}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { name, price, sellprice, brand, stock, gst } = selectedProduct;
      const updatedProduct = { name, price, sellprice, brand, stock, gst };

      await axios.put(url, updatedProduct, { headers });
      getAllProducts();
      handleClose(); // Close modal
      Swal.fire("Updated!", "Your product has been updated.", "success");
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire("Error!", "There was an error updating the product.", "error");
    }
  };

  const downloadReport = () => {
    if (products.length === 0) {
      Swal.fire("No Data", "There are no products to download!", "info");
      return;
    }

    const data = products.map((product, index) => ({
      "Sr. No": index + 1,
      Name: product.name,
      Price: product.price,
      "Sell Price": product.sellprice,
      Brand: product.brand,
      Category: product.category,
      Stock: product.stock,

      "GST (%)": product.gst || 0,
      Discription: product.discription,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product List");

    XLSX.writeFile(workbook, "Product_List_Report.xlsx");
    Swal.fire("Downloaded", "The report has been downloaded!", "success");
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4 d-flex justify-content-between">
            <h4 className="font-weight-bold text-primary">Product List</h4>
            <Button
              variant="contained"
              color="primary"
              onClick={downloadReport}
            >
              Download Report
            </Button>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="table-responsive">
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>Sr.No</th>
                    <th>Product Image & Name</th>
                    <th>Sell Price</th>
                    <th>Price</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>GST (%)</th>
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
                              src={`https://login.enagickangenwater.org/${product.image}`}
                              alt={product.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                marginRight: "10px",
                              }}
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.sellprice}</td>
                        <td>{product.price}</td>
                        <td>{product.brand}</td>
                        <td>{product.categoryName}</td>
                        <td>{product.stock}</td>
                        <td>{product.gst || 0}</td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Button
                              color="success"
                              onClick={() => handleEdit(product)}
                              style={{ backgroundColor: "rgba(26,159,83,0.2)" }}
                            >
                              <FaPencilAlt />
                            </Button>
                            <Button
                              color="error"
                              onClick={() => handleDelete(product._id)}
                              style={{ backgroundColor: "rgba(241,17,51,0.2)" }}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
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

      {/* Modal for editing product */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    label="Product Name"
                    fullWidth
                    value={selectedProduct.name}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    label="Price"
                    type="number"
                    fullWidth
                    value={selectedProduct.price}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        price: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    label="Sell Price"
                    type="number"
                    fullWidth
                    value={selectedProduct.sellprice}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        sellprice: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    label="Brand"
                    fullWidth
                    value={selectedProduct.brand}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        brand: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    label="GST (%)"
                    fullWidth
                    value={selectedProduct.gst}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        gst: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    label="Stock"
                    type="number"
                    fullWidth
                    value={selectedProduct.stock}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        stock: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Viewproductlist;
