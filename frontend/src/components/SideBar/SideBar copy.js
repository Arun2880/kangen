import React, { useState, useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [role, setRole] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    
    const storedRole = sessionStorage.getItem('Role');
    if (!storedRole) {
      navigate("/login"); // Redirect to login if no role found
    }
    setRole(storedRole);
  }, [navigate]);

  // Toggle submenu
  const isOpenSubmenu = (tabIndex) => {
    setActiveTab(activeTab === tabIndex ? null : tabIndex); // Toggle submenu
  };

  return (
    <div className="sidebar">
      <ul>
        {/* Common Dashboard for all roles */}
        <li>
          <Link to={`/${role === "admin" ? "dashboard" : role === "dealer" ? "dealerdashboard" : "userdashboard"}`}>
            <Button className="w-100 d-flex justify-content-between align-items-center">
              <span className="icon">
                <RxDashboard />
              </span>
              Dashboard
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>

        {/* Admin-specific menu */}
        {role === "admin" && (
          <>
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
            Dealer
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
                <Link to="/adddealer">Add Dealer</Link>
              </li>
              <li>
                <Link to="/viewdealer">View Dealers</Link>
              </li>
              <li>
                <Link to="/getconsumers">View Consumers by dealer</Link>
              </li>
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
            Consumer
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
                <Link to="/viewconsumer">View Consumer</Link>
              </li>
             
            </ul>
          </div>
        </li>

        

        {/* Stock Menu */}
        <li>
          <Button
            className={`w-100 d-flex justify-content-between align-items-center ${
              activeTab === 4 ? "active" : ""
            }`}
            onClick={() => isOpenSubmenu(4)}
            style={{ textDecoration: "none" }}
          >
            <span className="icon">
              <SiGooglecontaineroptimizedos />
            </span>
            Product
            <span className={`arrow ${activeTab === 4 ? "rotate" : ""}`}>
              <FaAngleRight />
            </span>
          </Button>
          <div
            className={`submenuWrapper ${
              activeTab === 4 ? "open" : "collapsed"
            }`}
          >
            <ul className="submenu">
              <li>
                <Link to="/addcategory">Add Category</Link>
              </li>
              <li>
                <Link to="/viewcategory">View Category</Link>
              </li>
              <li>
                <Link to="/addproduct">Add Product</Link>
              </li>
              <li>
                <Link to="/productlist">View Products</Link>
              </li>
            </ul>
          </div>
        </li>
          </>
        )}

        {/* Dealer-specific menu */}
        {role === "dealer" && (
          <>
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

          </>
        )}

        {/* User-specific menu */}
        {role === "" && (
          <li>
          <Link to="/dashboard">
            <Button className="w-100 d-flex justify-content-between align-items-center">
              <span className="icon">
                <RxDashboard />
              </span>
             Consumer Dashboard
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
