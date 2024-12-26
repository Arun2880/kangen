import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2"; 

const BASE_URL = "http://localhost:5000"; 

const Viewbilllist = () => {
  const [maindata, setmaindata] = useState([]);

  useEffect(() => {
    Getallclients();
  }, []);

  const Getallclients = async () => {
    try {
      
      const url = `${BASE_URL}/erika/allbill`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.get(url, { headers });

      console.log("All quotations data:", response.data.data);
      setmaindata(response.data.data);
    } catch (error) {
      console.error("Error connecting to API", error);
    }
  };

  const handleDownload = (pdfUrl) => {
    const fullUrl = `${BASE_URL}${pdfUrl}`; 
    window.open(fullUrl, "_blank"); 
  };

  const handleDelete = async (quoid) => {
    
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
          const url = `${BASE_URL}/erika/billdel/${quoid}`;
          const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
          };
          const response = await axios.delete(url, { headers });
          console.log("Response of delete API", response);

        
          setmaindata((prevData) => prevData.filter((item) => item._id !== quoid));

        
          Swal.fire("Deleted!", "Your quotation has been deleted.", "success");
        } catch (error) {
          console.error("Error connecting to API", error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  
  let sortedData = [...maindata].reverse();

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-success">All Billing</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="table-responsive">
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>Sr.No</th>
                    <th>Invoice ID</th>
                    <th>Client Name</th>
                    <th>Company Name</th>
                    <th>Quotation Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.length > 0 ? (
                    sortedData.map((quotation, index) => (
                      <tr key={quotation._id}>
                        <td>{index + 1}</td>
                        <td>{quotation.invoice_no}</td>
                        <td>{quotation.client_id.cus_name}</td>
                        <td>{quotation.client_id.company_name}</td>
                        <td>{new Date(quotation.bill_date).toLocaleDateString()}</td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Button
                              className="success"
                              color="success"
                              onClick={() => handleDownload(quotation.pdf_url)} 
                              style={{
                                backgroundColor: "rgba(26,159,83,0.2)",
                                fontSize: "50px !important",
                              }}
                            >
                              <MdDownload />
                            </Button>
                            <Button
                              className="error"
                              color="error"
                              onClick={() => handleDelete(quotation._id)} 
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
                      <td colSpan="6" className="text-center">
                        No quotations found.
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

export default Viewbilllist;
