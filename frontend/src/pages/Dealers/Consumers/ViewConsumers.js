import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Button, Modal, Box, TextField } from "@mui/material";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import BASE_url  from "../../../config/constants.js";

const ViewConsumers = () => {
  const token = sessionStorage.getItem("Token");
  //const BASE_url = "http://localhost:5000";

  const [consumers, setConsumers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentConsumer, setCurrentConsumer] = useState(null); // For the modal form
  const [formData, setFormData] = useState({ name: "", discount: "" });

  useEffect(() => {
    Getselfconsumers();
  }, []);

  const Getselfconsumers = async () => {
    try {
      const url = `${BASE_url}/api/dealer/mycon`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      setConsumers(response.data.data);
    } catch (error) {
      console.log("error fetching consumer list api", error);
    }
  };

  // Delete Consumer
  const handleDelete = (consumerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this consumer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const url = `${BASE_url}/api/dealer/delconsumer/${consumerId}`;
          const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          };

          await axios.delete(url, { headers });
          Swal.fire("Deleted!", "Consumer has been deleted.", "success");

          // Refresh the list after deletion
          Getselfconsumers();
        } catch (error) {
          console.log("error deleting consumer", error);
          Swal.fire("Error!", "Failed to delete the consumer.", "error");
        }
      }
    });
  };

  // Open Update Modal
  const handleOpen = (consumer) => {
    setCurrentConsumer(consumer);
    setFormData({ name: consumer.name, discount: consumer.discount || "" });
    setOpen(true);
  };

  // Close Modal
  const handleClose = () => setOpen(false);

  // Handle Form Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update Consumer
  const handleUpdate = async () => {
    try {
      const url = `${BASE_url}/api/dealer/updateconsumer/${currentConsumer._id}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const updatedData = {
        name: formData.name,
        discount: formData.discount,
      };

      await axios.put(url, updatedData, { headers });

      Swal.fire("Updated!", "Consumer details have been updated.", "success");

      // Refresh consumer list
      Getselfconsumers();
      handleClose();
    } catch (error) {
      console.log("error updating consumer", error);
      Swal.fire("Error!", "Failed to update the consumer.", "error");
    }
  };

  // Download Consumer Report as Excel
  const downloadReport = () => {
    if (consumers.length === 0) {
      Swal.fire("No Data", "No consumer data available to download.", "info");
      return;
    }

    const data = consumers.map((consumer, index) => ({
      "Sr. No": index + 1,
      Name: consumer.name,
      Email: consumer.email,
      "Referral Code": consumer.referralCode || "N/A",
      Discount: consumer.discount || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consumers");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "Consumer_Report.xlsx");
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4 d-flex justify-content-between">
            <h4 className="font-weight-bold text-primary">
              Total Consumer List Register by You
            </h4>
            <Button
              variant="contained"
              color="primary"
              onClick={downloadReport}
            >
              <FaDownload style={{ marginRight: "8px" }} />
              Download Report
            </Button>
          </div>

          {/* <div className="mb-3 text-right">
            <Button
              variant="contained"
              color="primary"
              onClick={downloadReport}
            >
              Download Report
            </Button>
          </div> */}

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
                  {consumers && consumers.length > 0 ? (
                    consumers.map((consumer, index) => (
                      <tr key={consumer._id}>
                        <td>{index + 1}</td>
                        <td>{consumer.name}</td>
                        <td>{consumer.email}</td>
                        <td>{consumer.referralCode || "N/A"}</td>
                        <td>{consumer.discount || "N/A"}</td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Button
                              className="success"
                              color="success"
                              style={{
                                backgroundColor: "rgba(26,159,83,0.2)",
                              }}
                              onClick={() => handleOpen(consumer)}
                            >
                              <FaPencilAlt />
                            </Button>
                            <Button
                              className="error"
                              color="error"
                              style={{
                                backgroundColor: "rgba(241,17,51,0.2)",
                              }}
                              onClick={() => handleDelete(consumer._id)}
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
                        No Consumers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Updating Consumer */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h4>Update Consumer</h4>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            fullWidth
          >
            Update
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewConsumers;
