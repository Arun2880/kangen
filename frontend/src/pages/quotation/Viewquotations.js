import React, { useEffect, useState } from "react";
import "../../assests/css/comman.css";
import { Button, TextField } from "@mui/material";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import BASE_url  from "../../config/constants.js";
import * as XLSX from "xlsx";

const ViewAllQuotation = () => {
  const [consumers, setConsumers] = useState([]);
  const [filteredConsumers, setFilteredConsumers] = useState([]); // State for filtered consumers
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ name: "", discount: "" }); // Filter state

  const token = sessionStorage.getItem("Token");
  const BASE_url = "http://localhost:5000";

  useEffect(() => {
    getConsumerList();
  }, []);

  useEffect(() => {
    applyFilters(); // Apply filters whenever the data or filter state changes
  }, [consumers, filter]);

  // Fetch consumers from the API
  const getConsumerList = async () => {
    try {
      const url = `${BASE_url}/api/admin/allconsumers`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      console.log("consumer list", response);
      const consumerData = response.data.data;
      setConsumers(consumerData); // Set the consumers data
    } catch (error) {
      console.log("Error fetching consumers list: ", error);
      setError("Failed to fetch consumers.");
    }
  };

  // Filter function for applying the filters based on name and discount
  const applyFilters = () => {
    let filteredList = consumers;
  
    // Filter by name if filter.name is not empty
    if (filter.name) {
      filteredList = filteredList.filter((consumer) =>
        consumer.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }
  
    // Filter by discount if filter.discount is not empty and discount exists
    if (filter.discount) {
      filteredList = filteredList.filter((consumer) =>
        consumer.discount !== undefined && consumer.discount !== null // Check if discount exists
          ? consumer.discount.toString().includes(filter.discount) // Convert to string if it's a number
          : false // If discount is undefined or null, don't include it
      );
    }
  
    setFilteredConsumers(filteredList); // Update the filtered consumers list
  };
  

  // Handle filter input changes
  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  // Handle download report
  const handleDownloadReport = () => {
    if (filteredConsumers.length === 0) {
      Swal.fire("No Data", "No consumers available to download.", "info");
      return;
    }

    // Prepare data for Excel
    const worksheet = XLSX.utils.json_to_sheet(filteredConsumers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consumers");

    // Create Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Trigger download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Consumer_Report.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4 d-flex justify-content-between align-items-center">
            <h4 className="font-weight-bold text-primary">Total Consumer List</h4>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadReport}
              startIcon={<FaDownload />}
            >
              Download Report
            </Button>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            {/* Filter Section */}
            <div className="d-flex mb-4">
              <TextField
                label="Filter by Name"
                variant="outlined"
                name="name"
                value={filter.name}
                onChange={handleFilterChange}
                className="mr-2"
                fullWidth
              />
              <TextField
                label="Filter by Discount"
                variant="outlined"
                name="discount"
                value={filter.discount}
                onChange={handleFilterChange}
                fullWidth
              />
            </div>

            <div className="table-responsive">
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>Sr.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Refral Code</th>
                    <th>Discount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsumers && filteredConsumers.length > 0 ? (
                    filteredConsumers.map((consumer, index) => (
                      <tr key={consumer._id}>
                        <td>{index + 1}</td>
                        <td>{consumer.name}</td>
                        <td>{consumer.email}</td>
                        <td>{consumer.referralCode}</td>
                        <td>{consumer.discount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No consumers found.
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
    </div>
  );
};

export default ViewAllQuotation;
