import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { ImNext } from "react-icons/im";

const Createbill = () => {

  let BASE_URL="http://localhost:5000";
  const [clients, setClients] = useState([]); 
  const [selectedClient, setSelectedClient] = useState(""); 
  const [clientDetails, setClientDetails] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    Getallclients();
  }, []);

  // ---------------- Customer list API ---------------------------
  const Getallclients = async () => {
    try {
      const url = `${BASE_URL}/erika/allcus`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.get(url, { headers });
      console.log("all data", response);
      const allClientsData = response.data.data[0]; 
      setClients(allClientsData);
    } catch (error) {
      console.error("Error connecting to API", error);
    }
  };

  // ---------------- Get single customer details -------------------
  const GetSinglecustomer = async () => {
    if (!selectedClient) {
      alert("Please select a client first.");
      return;
    }

    try {
      const url = `${BASE_URL}/erika/singlecus/${selectedClient}`; 
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.get(url, { headers });

      console.log("response of single customer", response);
      setClientDetails(response.data);
      console.log("client details", clientDetails); 
    } catch (error) {
      console.error("Error fetching client details", error);
    }
  };

  // -----------------------end--------------------------------


  const handleClientChange = (e) => {
    setSelectedClient(e.target.value);
  };


  const Addnewcus = () => {
    navigate("/addclient");
  };

  const handleNext = () => {
    console.log("selected client id is=", selectedClient);
    navigate("/selectproduct", { state: { clientId: selectedClient } });
  };
  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-success">Create Quotation</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="row d-flex  justify-content-around">
              <div className="col-md-8">
                <div className="form-group">
                  <label htmlFor="clientDropdown">
                    If the client is already added, please select from the
                    dropdown
                  </label>

                  <select
                    id="clientDropdown"
                    className="form-control mt-3"
                    onChange={handleClientChange}
                    value={selectedClient}
                  >
                    <option value="">--Select Client--</option>
                    {clients.map((client, index) => (
                      <option key={index} value={client._id}>
                        {" "}
                        {client.cus_name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  className="mt-3 px-4 py-2"
                  variant="contained"
                  onClick={handleNext}
                >
                  <span className="h5 mr-2">
                    <ImNext />
                  </span>
                  Next
                </Button>

                <Button
                  className="mt-3 px-4 py-2 ml-3"
                  variant="contained"
                  color="success"
                  onClick={GetSinglecustomer}
                >
                  <span className="mr-2 h5">
                    <FaEye />
                  </span>
                  View Details
                </Button>

                {/* Display client details below */}
              </div>

              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="newCustomer">Add New Customer</label>

                  <Button
                    className="mt-3 px-4 py-2"
                    variant="contained"
                    onClick={Addnewcus}
                  >
                    New Customer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-container bg-white p-4 shadow-sm ">
        <div className="section-heading p-2 mb-4 v">
          <h5 className="font-weight-bold">Customer Details</h5>
        </div>
        <div className="row">
          {clientDetails && (
            <>
              <div className="col-md-6 ">
                <table className="table table-bordered w-100">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Name:</strong>
                      </td>
                      <td>{clientDetails.data[0].cus_name}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Email:</strong>
                      </td>
                      <td>{clientDetails.data[0].cus_mail}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Phone:</strong>
                      </td>
                      <td>{clientDetails.data[0].phone}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Address:</strong>
                      </td>
                      <td>{clientDetails.data[0].Locality}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <table className="table table-bordered w-100">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Company Name:</strong>
                      </td>
                      <td>{clientDetails.data[0].company_name}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>City:</strong>
                      </td>
                      <td>{clientDetails.data[0].City}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>State:</strong>
                      </td>
                      <td>{clientDetails.data[0].State}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Zip:</strong>
                      </td>
                      <td>{clientDetails.data[0].zip}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Createbill;
