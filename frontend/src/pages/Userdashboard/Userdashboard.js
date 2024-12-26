import React, { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import Button from "@mui/material/Button";
import DashboardBox from "./dashboardBox/dashboardBox";
import { FaUserCircle, FaRegMoneyBillAlt } from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";
import { PiShippingContainerFill } from "react-icons/pi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import BASE_url  from "../../config/constants.js";

const Userdashboard = () => {
  const token = sessionStorage.getItem("Token");
  //const BASE_url = "http://localhost:5000";
  const [totalconsumer, setConsumers] = useState("");
  const [withreral, setOrders] = useState("");
  const [yourorder, setselfOrders] = useState("");
  const [userId,setUserId]=useState("");
  const [eraning,setTotalearning]=useState("");

  const navigate = useNavigate();
  if(!token){
    navigate("/")
  }

  useEffect(() => {
    if (token) {
        const decoded = jwtDecode(token);
        console.log("id", decoded);
        setUserId(decoded.id);
    }
}, [token]);

useEffect(() => {
    if (userId) {
      Getselfconsumers();
      Getorder();
      GetOrderlist();
      Getearning();
    }
}, [userId]);

  const Getselfconsumers = async () => {
    try {
      const url = `${BASE_url}/api/dealer/mycon`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      if (response.data && response.data.data.length > 0) {
        setConsumers(response.data.data.length);
      }
    } catch (error) {
      console.log("error fetching consumer list api", error);
    }
  };

  const Getorder = async () => {
    try {
      const url = `${BASE_url}/api/dealer/allorders`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      if (response.data && response.data.data.length > 0) {
        setOrders(response.data.data.length);
      }
    } catch (error) {
      console.log("Get Order api error", error);
    }
  };

  const GetOrderlist = async () => {
    try {
      const url = `${BASE_url}/api/dealer/getorder`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      setselfOrders(response.data.data.length);
    } catch (error) {
      console.log("Error in order list API", error);
    }
  };

  // -------------------------------navigaet--------------------

  const Getearning = async () => {
    try {
        const url = `${BASE_url}/api/dealer/earncommission/${userId}`;
        const response = await axios.get(url);
        console.log("response of earning api", response);
        setTotalearning(response.data.data.totalCommission);
       

    } catch (error) {
        console.log("Error in earning API", error);
    }
}


  // --------------------------------end----------------------------

  // Define menu items for each DashboardBox
  const totalConsumersMenu = [
    { title: "View Client", onClick: () => navigate('/viewdealerconsumer') },
    // { title: "View Client", onClick: () => console.log("View Client clicked") },
  ];

  const totalOrdersMenu = [
    { title: "View Orders", onClick: () => navigate('/consumerorders') },
    // { title: "Cancel Order", onClick: () => console.log("Cancel Order clicked") },
  ];

  const selfOrdersMenu = [
    { title: "view your order", onClick: () => navigate('/orders') },
    // { title: "Order History", onClick: () => console.log("Order History clicked") },
  ];

  const totalProductsMenu = [
    { title: "View Earning", onClick: () => navigate('/earning') },
    // { title: "View Products", onClick: () => console.log("View Products clicked") },
  ];

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="dashboardBoxWrapper d-flex">
            <DashboardBox
              color={["#1da256", "#48d483"]}
              icon={<FaUserCircle />}
              title="Total Consumers"
              value={totalconsumer}
              grow={true}
              menuItems={totalConsumersMenu} // Pass menu items for this box
            />
            {/* <DashboardBox
              color={["#c012e2", "#eb64fe"]}
              icon={<MdMenuBook />}
              title=" Your total Orders"
              value={withreral}
              grow={false}
              menuItems={totalOrdersMenu} // Pass menu items for this box
            />
            <DashboardBox
              color={["#2c78e5", "#60aff5"]}
              icon={<FaRegMoneyBillAlt />}
              title="Self Orders"
              value={yourorder}
              grow={true}
              menuItems={selfOrdersMenu} // Pass menu items for this box
            />
            <DashboardBox
              color={["#e1950e", "#f3cd29"]}
              icon={<PiShippingContainerFill />}
              title="Total Earning"
              value={`${eraning} Rs`} // Example value for total products
              grow={false}
              menuItems={totalProductsMenu} // Pass menu items for this box
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userdashboard;
