import React, { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import Button from "@mui/material/Button";
import DashboardBox from "./dashboardBox/dashboardBox";
import { FaUserCircle, FaRegMoneyBillAlt } from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";
import { PiShippingContainerFill } from "react-icons/pi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Chart } from "react-google-charts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_url  from "../../config/constants.js";

// Minimal or empty data
export const options = {
  pieSliceText: "none",
};

const Dashboard = () => {
  const token = sessionStorage.getItem("Token");
  //const BASE_url = "http://localhost:5000";
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const [totaldealers, setDealers] = useState("");
  const [productlist, setProducts] = useState("");
  const [totalconsumers, setConsumers] = useState("");
  const [totalcategory, setCategory] = useState("");
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  if(!token){
    navigate("/")
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
    Getdealerlist();
    getAllProducts();
    getConsumerList();
    getCategoryList();
  }, []);

  // -----------------------get client number ---------------------------
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
      setDealers(dealerData.length); 
    } catch (error) {
      console.log("Error fetching dealers list: ", error);
    }
  };

  // -----------------------------total quotation generated-----------------------
  const getAllProducts = async () => {
    try {
      const url = `${BASE_url}/api/admin/productlist`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.get(url, { headers });
      setProducts(response.data.data.length); 
    } catch (error) {
      console.error("Error getting product list", error);
    }
  };

  // ----------------------get all consumers------------------------
  const getConsumerList = async () => {
    try {
      const url = `${BASE_url}/api/admin/allconsumers`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      const consumerData = response.data.data;
      setConsumers(consumerData.length); 
    } catch (error) {
      console.log("Error fetching consumers list: ", error);
    }
  };

  // -------------------------------total category count-------------------------------
  const getCategoryList = async () => {
    try {
      const url = `${BASE_url}/api/admin/getcategory`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(url, { headers });
      const categoryData = response.data.data;
      setCategory(categoryData.length); 
    } catch (error) {
      console.log("Error fetching category list: ", error);
    }
  };


  const totalDealersMenu = [
    { title: "View Dealers", onClick: () => navigate("/viewdealer") },
  ];

  const totalProductsMenu = [
    { title: "View Products", onClick: () => navigate("/productlist") },
  ];

  const totalConsumersMenu = [
    { title: "View Consumers", onClick: () => navigate("/viewconsumer") },
  ];

  const totalCategoryMenu = [
    { title: "View Categories", onClick: () => navigate("/viewcategory") },
  ];

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="dashboardBoxWrapper d-flex">
            <DashboardBox
              color={["#1da256", "#48d483"]}
              icon={<FaUserCircle />}
              title="Total Dealers"
              value={totaldealers}
              grow={true}
              menuItems={totalDealersMenu}
            />
            <DashboardBox
              color={["#c012e2", "#eb64fe"]}
              icon={<MdMenuBook />}
              title="Total Products"
              value={productlist}
              grow={false}
              menuItems={totalProductsMenu}
            />
            <DashboardBox
              color={["#2c78e5", "#60aff5"]}
              icon={<FaRegMoneyBillAlt />}
              title="Total Consumers"
              value={totalconsumers}
              grow={true}
              menuItems={totalConsumersMenu}
            />
            <DashboardBox
              color={["#e1950e", "#f3cd29"]}
              icon={<PiShippingContainerFill />}
              title="Total Category"
              value={totalcategory}
              grow={false}
              menuItems={totalCategoryMenu}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
