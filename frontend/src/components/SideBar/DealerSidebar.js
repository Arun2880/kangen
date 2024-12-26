import React, { useState } from "react";
import Button from "@mui/material/Button";
import { RxDashboard } from "react-icons/rx";
import {
  FaAngleRight,
  FaRegUser,
  FaRegListAlt,
  FaRegMoneyBillAlt,
} from "react-icons/fa";
import { SiGooglecontaineroptimizedos } from "react-icons/si";
import { PiShippingContainerFill } from "react-icons/pi";
import { IoBarChartOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const DealerSidebar = () => {
  const [activeTab, setActiveTab] = useState(null);

  // Toggle submenu
  const isOpenSubmenu = (tabIndex) => {
    setActiveTab(activeTab === tabIndex ? null : tabIndex); // Toggle submenu
  };

  return (
    <div className="sidebar">
      <ul>
     
        <li>
          <Link to="/dealerdashboard">
            <Button className="w-100 d-flex justify-content-between align-items-center">
              <span className="icon">
                <RxDashboard />
              </span>
             Dealer Dashboard
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>

        {/* Client Menu */}
        <li>
          <Button
            className={`w-100 d-flex justify-content-between align-items-center ${
              activeTab === 1 ? "active" : ""
            }`}
            onClick={() => isOpenSubmenu(1)}
            style={{ textDecoration: "none" }}
          >
            <span className="icon">
              <FaRegUser />
            </span>
            Consumer
            <span className={`arrow ${activeTab === 1 ? "rotate" : ""}`}>
              <FaAngleRight />
            </span>
          </Button>
          <div
            className={`submenuWrapper ${
              activeTab === 1 ? "open" : "collapsed"
            }`}
          >
            <ul className="submenu">
              <li>
                <Link to="/addconsumer">Add Consumer</Link>
              </li>
              <li>
                <Link to="/viewdealerconsumer">View Consumers</Link>
              </li>
              {/* <li>
                <Link to="/getconsumers">View Consumers by dealer</Link>
              </li> */}
            </ul>
          </div>
        </li>

        {/* Quotation Menu */}
        <li>
          <Button
            className={`w-100 d-flex justify-content-between align-items-center ${
              activeTab === 2 ? "active" : ""
            }`}
            onClick={() => isOpenSubmenu(2)}
            style={{ textDecoration: "none" }}
          >
            <span className="icon">
              <FaRegListAlt />
            </span>
            Orders
            <span className={`arrow ${activeTab === 2 ? "rotate" : ""}`}>
              <FaAngleRight />
            </span>
          </Button>
          <div
            className={`submenuWrapper ${
              activeTab === 2 ? "open" : "collapsed"
            }`}
          >
            <ul className="submenu">
              <li>
                <Link to="/orders">Your Orders</Link>
              </li>
              <li>
                <Link to="/consumerorders">All Orders</Link>
              </li>
            </ul>
          </div>
        </li>

        

        {/* Stock Menu */}
        <li>
          <Link to="/products">
            <Button className="w-100 d-flex justify-content-between align-items-center">
              <span className="icon">
                <RxDashboard />
              </span>
             Buy
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/history">
            <Button className="w-100 d-flex justify-content-between align-items-center">
              <span className="icon">
                <RxDashboard />
              </span>
             History
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>

       

        {/* Stock Menu */}
       
      </ul>
    </div>
  );
};

export default DealerSidebar;
