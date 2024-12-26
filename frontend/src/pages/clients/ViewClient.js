import React, { useEffect, useState } from "react";
import "../../assests/css/comman.css";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Button, Modal, Box, TextField } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import BASE_url  from "../../config/constants.js";

const ViewClient = () => {
  const [dealers, setDealers] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [updatedDealer, setUpdatedDealer] = useState({
    name: "",
    email: "",
    referralCode: "",
    discount: "",
  });

  // State for filtering
  const [filter, setFilter] = useState({
    name: "",
    discount: "",
  });

  const token = sessionStorage.getItem("Token");
  const navigate = useNavigate();
  //const BASE_url = "http://localhost:5000";

  useEffect(() => {
    Getdealerlist();
  }, []);

  useEffect(() => {
    applyFilters(); // Apply filters whenever filter state changes
  }, [filter, dealers]);

  const Getdealerlist = async () => {
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
      setFilteredDealers(dealerData); // Initialize filtered dealers with all dealers
    } catch (error) {
      console.log("Error fetching dealers list: ", error);
    }
  };

  // Apply filters to dealers list
  const applyFilters = () => {
    let filteredList = dealers;
  
    if (filter.name) {
      filteredList = filteredList.filter((dealer) =>
        dealer.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }
  
    if (filter.discount) {
      filteredList = filteredList.filter((dealer) => {
        
        const discountStr = dealer.discount ? dealer.discount.toString() : '';
        return discountStr.toLowerCase().includes(filter.discount.toLowerCase());
      });
    }
  
    setFilteredDealers(filteredList);
  };

  // Function to handle open modal
  const handleOpen = (dealer) => {
    setSelectedDealer(dealer);
    setUpdatedDealer({
      name: dealer.name,
      email: dealer.email,
      referralCode: dealer.referralCode || "",
      discount: dealer.discount || "",
    });
    setOpen(true);
  };

  // Function to handle close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedDealer(null);
  };

  // Function to handle updating dealer
  const handleUpdateDealer = async () => {
    try {
      const url = `${BASE_url}/api/admin/updatedealer/${selectedDealer._id}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.put(url, updatedDealer, { headers });
      if (response.status === 200) {
        Swal.fire("Success", "Dealer updated successfully", "success");
        handleClose();
        Getdealerlist(); 
      }
    } catch (error) {
      console.log("Error updating dealer: ", error);
      Swal.fire("Error", "Failed to update dealer", "error");
    }
  };

  // Function to handle change in form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDealer({ ...updatedDealer, [name]: value });
  };

  // Function to handle delete dealer
  const handleDeleteDealer = async (dealerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const url = `${BASE_url}/api/admin/deldealer/${dealerId}`;
          const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.delete(url, { headers });
          if (response.status === 200) {
            Swal.fire("Deleted!", "Dealer has been deleted.", "success");
            Getdealerlist(); // Refresh the list after deletion
          }
        } catch (error) {
          console.log("Error deleting dealer: ", error);
          Swal.fire("Error", "Failed to delete dealer", "error");
        }
      }
    });
  };

  const handleDownloadReport = () => {
    if (filteredDealers.length === 0) {
      Swal.fire("No Data", "There is no data to download", "info");
      return;
    }

    const dealerDataForExcel = filteredDealers.map((dealer, index) => ({
      "Sr. No.": index + 1,
      Name: dealer.name,
      Email: dealer.email,
      "Referral Code": dealer.referralCode || "N/A",
      Discount: dealer.discount || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dealerDataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dealers Report");

    // Save the file
    XLSX.writeFile(workbook, "Dealers_Report.xlsx");
  };

  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4 d-flex justify-content-between align-items-center">
            <h4 className="font-weight-bold text-primary">Total Dealer List</h4>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadReport}
            >
              Download Report
            </Button>
          </div>

          {/* Filter Section */}
          <div className="d-flex ">
          <div className="filter-section mb-4 col-md-3">
            <TextField
              label="Filter by Name"
              variant="outlined"
              fullWidth
              name="name"
              value={filter.name}
              onChange={handleFilterChange}
            />
            </div>
            <div className="filter-section mb-4 col-md-3">
            <TextField
              label="Filter by Discount"
              variant="outlined"
              fullWidth
              name="discount"
              value={filter.discount}
              onChange={handleFilterChange}
            />
          </div>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="table-responsive">
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>Sr.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Referral Code</th>
                    <th>Discount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDealers && filteredDealers.length > 0 ? (
                    filteredDealers.map((dealer, index) => (
                      <tr key={dealer._id}>
                        <td>{index + 1}</td>
                        <td>{dealer.name}</td>
                        <td>{dealer.email}</td>
                        <td>{dealer.referralCode || "N/A"}</td>
                        <td>{dealer.discount || "N/A"}</td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Button
                              className="success"
                              color="success"
                              style={{
                                backgroundColor: "rgba(26,159,83,0.2)",
                              }}
                              onClick={() => handleOpen(dealer)}
                            >
                              <FaPencilAlt />
                            </Button>
                            <Button
                              className="error"
                              color="error"
                              style={{
                                backgroundColor: "rgba(241,17,51,0.2)",
                              }}
                              onClick={() => handleDeleteDealer(dealer._id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No dealers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Updating Dealer */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Dealer</h5>
            <Button onClick={handleClose}>Close</Button>
          </div>
          <div className="modal-body">
            <TextField
              label="Name"
              fullWidth
              name="name"
              value={updatedDealer.name}
              onChange={handleInputChange}
            />
            <TextField
              label="Email"
              fullWidth
              name="email"
              value={updatedDealer.email}
              onChange={handleInputChange}
            />
            <TextField
              label="Referral Code"
              fullWidth
              name="referralCode"
              value={updatedDealer.referralCode}
              onChange={handleInputChange}
            />
            <TextField
              label="Discount"
              fullWidth
              name="discount"
              value={updatedDealer.discount}
              onChange={handleInputChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateDealer}
              className="mt-3"
            >
              Update Dealer
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewClient;
