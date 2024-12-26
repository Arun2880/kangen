import React, { useEffect, useState } from "react";
import "../../assests/css/comman.css";
import { FaEye, FaPencilAlt, FaTrash, FaShoppingCart } from "react-icons/fa";
import { Button, Modal, Box, TextField } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert

const Viewaddstock = () => {
  let BASE_URL="http://localhost:5000";

  const [stockList, setStockList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [issueQuantity, setIssueQuantity] = useState("");
  const [editFormData, setEditFormData] = useState({
    product_id: "",
    product_name: "",
    initial_stock: "",
    product_price_unit: "",
  });
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    Getstocklist();
  }, []);

  const Getstocklist = async () => {
    try {
      const url = `${BASE_URL}/erika/getstockproductlist`;
      const response = await axios.get(url);
      setStockList(response.data.data[0]); 
    } catch (error) {
      console.error("Error in get product list API", error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
    setIssueQuantity("");
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      product_id: product.product_id,
      product_name: product.product_name,
      initial_stock: product.initial_stock,
      product_price_unit: product.product_price_unit,
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedProduct(null);
  };

  const handleIssueStock = async () => {
    if (!issueQuantity) {
      Swal.fire("Error", "Please enter the quantity to issue.", "error");
      return;
    }

    try {
      const url = `${BASE_URL}/erika/issuestock/${selectedProduct._id}`;
      const data = { issue_quantity: issueQuantity };
      await axios.post(url, data);
      Swal.fire("Success", "Stock issued successfully", "success");
      Getstocklist();
      handleCloseModal();
    } catch (error) {
      console.error("Error in issuing stock", error);
      Swal.fire("Error", "Something went wrong while issuing stock.", "error");
    }
  };

  const handleEditStock = async () => {
    try {
      const url = `${BASE_URL}/erika/updatestockproduct/${selectedProduct._id}`;
      const data = { ...editFormData };
      await axios.put(url, data);
      Swal.fire("Success", "Stock updated successfully", "success");
      Getstocklist();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error in editing stock", error);
      Swal.fire("Error", "Something went wrong while updating the stock.", "error");
    }
  };

  const handleInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const Deletestock = async () => {
    if (!selectedProduct) return;

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const url = `${BASE_URL}/erika/delstockpro/${selectedProduct._id}`;
        await axios.delete(url);
        Swal.fire("Deleted!", "Your stock has been deleted.", "success");
        Getstocklist();
      } catch (error) {
        console.log("Error in delete stock API", error);
        Swal.fire("Error", "Something went wrong while deleting the stock.", "error");
      }
    }
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-primary">Total Stock List</h4>
          </div>

          {loading ? ( // Show loading indicator while fetching data
            <div>Loading...</div>
          ) : (
            <div className="form-container bg-white p-4 shadow-sm">
              <div className="table-responsive">
                <table className="table table-bordered v-align">
                  <thead className="thead-dark">
                    <tr>
                      <th>Sr.No</th>
                      <th>Product Id</th>
                      <th>Product Name</th>
                      <th>Initial Stock</th>
                      <th>Stock Add Date</th>
                      <th>Product Price</th>
                      <th>Issued Stock</th>
                      <th>Issue Date(s)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockList && stockList.length > 0 ? (
                      stockList.map((product, index) => (
                        <tr key={product._id}>
                          <td>{index + 1}</td>
                          <td>{product.product_id}</td>
                          <td>{product.product_name}</td>
                          <td>{product.initial_stock}</td>
                          <td>{new Date(product.initial_stock_date).toLocaleDateString()}</td>
                          <td>{product.product_price_unit}</td>
                          <td>
                            {product.issued_stock_history?.map((issue) => (
                              <div key={issue._id}>{issue.issued_quantity}</div>
                            ))}
                          </td>
                          <td>
                            {product.issued_stock_history?.map((issue) => (
                              <div key={issue._id}>{new Date(issue.issued_date).toLocaleDateString()}</div>
                            ))}
                          </td>
                          <td>
                            <div className="actions d-flex align-items-center">
                              <Button
                                className="secondary"
                                color="secondary"
                                style={{
                                  backgroundColor: "rgba(203,60,231,0.2)",
                                }}
                                onClick={() => handleOpenModal(product)}
                              >
                                <FaShoppingCart />
                              </Button>
                              <Button
                                className="success"
                                color="success"
                                style={{
                                  backgroundColor: "rgba(26,159,83,0.2)",
                                }}
                                onClick={() => handleOpenEditModal(product)}
                              >
                                <FaPencilAlt />
                              </Button>
                              <Button
                                className="error"
                                color="error"
                                style={{
                                  backgroundColor: "rgba(241,17,51,0.2)",
                                }}
                                onClick={Deletestock}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for issuing stock */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="issue-stock-modal"
        aria-describedby="issue-stock-form"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h4 id="issue-stock-modal">Issue Stock for {selectedProduct?.product_name}</h4>
          <TextField
            label="Quantity"
            value={issueQuantity}
            onChange={(e) => setIssueQuantity(e.target.value)}
            fullWidth
            margin="normal"
          />
          <div className="d-flex justify-content-end">
            <Button variant="contained" color="primary" onClick={handleIssueStock}>
              Issue
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseModal} sx={{ ml: 2 }}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Modal for editing stock */}
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-stock-modal"
        aria-describedby="edit-stock-form"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h4 id="edit-stock-modal">Edit Stock for {editFormData.product_name}</h4>

          <div className="row">
            <dic className="col-md-6">
            <TextField
            label="Product ID"
            name="Product ID"
            value={editFormData.product_id}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
            </dic>
            <div className="col-md-6">
            <TextField
            label="Product Name"
            name="product_name"
            value={editFormData.product_name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
            </div>
           
          </div>
         

         <div className="row">
            <div className="col-md-6">
            <TextField
            label="Initial Stock"
            name="initial_stock"
            value={editFormData.initial_stock}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="number"
          />
            </div>
            <div className="col-md-6">
            <TextField
            label="Product Price"
            name="product_price_unit"
            value={editFormData.product_price_unit}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="number"
          />
            </div>
         </div>
         
          
          <div className="d-flex justify-content-end">
            <Button variant="contained" color="primary" onClick={handleEditStock}>
              Update
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseEditModal} sx={{ ml: 2 }}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Viewaddstock;
