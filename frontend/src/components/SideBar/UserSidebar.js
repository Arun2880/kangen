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

const UserSidebar = () => {
  const [activeTab, setActiveTab] = useState(null);

  // Toggle submenu
  const isOpenSubmenu = (tabIndex) => {
    setActiveTab(activeTab === tabIndex ? null : tabIndex); 
  };

  return (
    <div className="sidebar">
      <ul>
        {/* Dashboard Menu (No Submenu) */}
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
        <li>
          <Link to="/productlist">
            <Button className="w-100 d-flex justify-content-between align-items-center">
              <span className="icon">
                <RxDashboard />
              </span>
            Buy Now
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>

    

        

       
      </ul>
    </div>
  );
};

export default UserSidebar;
