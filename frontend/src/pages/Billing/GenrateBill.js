import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Genratebill = () => {
  const BASE_URL=`http://localhost:5000`
  const location = useLocation();
  const navigate = useNavigate();
  const { clientId } = location.state || {}; 

  console.log("Client ID:", clientId);


  const [selectedDate, setSelectedDate] = useState("");
  const [includeGst, setIncludeGst] = useState("");

  const FinalQuotation = async () => {
    try {
      const url = `${BASE_URL}/erika/realbill`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const requestBody = {
        client_id: clientId,
        bill_date: selectedDate,
        include_gst: includeGst === "yes", 
      };
console.log("request body of final bill",requestBody);
      const response = await axios.post(url, requestBody, {
        headers: headers,
      });

      console.log("Final quotation API response", response);

      
      await Swal.fire({
        title: 'Success!',
        text: 'Bill created successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });


      navigate('/allbill', { state: { quotation: response.data } });
      
    } catch (error) {
      console.error("Error connecting to API", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create quotation. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-success">Generate Quotation and Download</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="billingDate">Select Date</label>
                  <input
                    type="date"
                    id="billingDate"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="includeGst">Include GST?</label>
                  <select
                    id="includeGst"
                    className="form-control"
                    value={includeGst}
                    onChange={(e) => setIncludeGst(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
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
                  onClick={FinalQuotation}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Genratebill;
