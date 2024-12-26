import React, { useEffect, useState } from "react";
import "../../assests/css/comman.css";
import { Button, Modal, TextField } from "@mui/material";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import BASE_url  from "../../config/constants.js";
import * as XLSX from "xlsx";

const Viewcategory = () => {
  const [categorys, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = sessionStorage.getItem("Token");
 // const BASE_url = "http://localhost:5000";

  useEffect(() => {
    getCategoryList();
  }, []);

  // Fetch category list from the API
  const getCategoryList = async () => {
    try {
      const url = `${BASE_url}/api/admin/getcategory`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(url, { headers });
      const categoryData = response.data.data;
      setCategory(categoryData); // Set the category data
    } catch (error) {
      console.log("Error fetching category list: ", error);
      setError("Failed to fetch categories.");
    }
  };

  // Open the update modal
  const openUpdateModal = (category) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name); // Set initial name in the modal
    setIsModalOpen(true);
  };

  // Close the update modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setNewCategoryName("");
  };

  // Update category by ID
  const updateCategory = async () => {
    try {
      const url = `${BASE_url}/api/admin/updatecategory/${selectedCategory._id}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.put(
        url,
        { name: newCategoryName },
        { headers }
      );

      if (response.status === 200) {
        // Update the category list
        setCategory((prevCategories) =>
          prevCategories.map((category) =>
            category._id === selectedCategory._id
              ? { ...category, name: newCategoryName }
              : category
          )
        );
        Swal.fire("Updated!", "Category has been updated.", "success");
        closeModal();
      }
    } catch (error) {
      console.error("Error updating category:", error);
      Swal.fire("Error!", "Failed to update the category.", "error");
    }
  };

  // Delete category by ID
  const deleteCategory = async (id) => {
    try {
      const url = `${BASE_url}/api/admin/delcategory/${id}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.delete(url, { headers });
      console.log("Delete response", response);

      if (response.status === 200) {
        setCategory((prevCategories) =>
          prevCategories.filter((category) => category._id !== id)
        );
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      Swal.fire("Error!", "Failed to delete the category.", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategory(id);
      }
    });
  };

  // Export categories to Excel
  const exportToExcel = () => {
    if (categorys.length === 0) {
      Swal.fire("No Data", "There are no categories to export.", "info");
      return;
    }
    const dataToExport = categorys.map((category, index) => ({
      "Sr. No": index + 1,
      ID: category._id,
      "Category Name": category.name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");

    XLSX.writeFile(workbook, "Categories_Report.xlsx");
    Swal.fire("Downloaded", "The report has been downloaded!", "success");
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4 d-flex justify-content-between align-items-center">
            <h4 className="font-weight-bold text-primary">
              Total Added Category List
            </h4>
            <Button variant="contained" color="primary" onClick={exportToExcel}>
              Download Report
            </Button>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="table-responsive">
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>Sr.No</th>
                    <th>Category Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categorys && categorys.length > 0 ? (
                    categorys.map((category, index) => (
                      <tr key={category._id}>
                        <td>{index + 1}</td>
                        <td>{category.name}</td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Button
                              color="primary"
                              onClick={() => openUpdateModal(category)}
                              style={{
                                backgroundColor: "rgba(0,123,255,0.2)",
                                marginRight: "5px",
                              }}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              className="error"
                              color="error"
                              style={{
                                backgroundColor: "rgba(241,17,51,0.2)",
                              }}
                              onClick={() => handleDelete(category._id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Error message */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>

      {/* Update Category Modal */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <div
          className="modal-content p-4"
          style={{ width: "400px", margin: "auto", marginTop: "10%" }}
        >
          <h4 className="mb-4">Update Category</h4>
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <div className="d-flex justify-content-end mt-3">
            <Button
              onClick={updateCategory}
              variant="contained"
              color="primary"
              className="mr-2"
            >
              Update
            </Button>
            <Button onClick={closeModal} variant="outlined" color="secondary">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Viewcategory;
