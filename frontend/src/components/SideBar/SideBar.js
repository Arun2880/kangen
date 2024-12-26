import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { RxDashboard } from "react-icons/rx";
import { FaAngleRight, FaRegUser, FaRegListAlt } from "react-icons/fa";
import { SiGooglecontaineroptimizedos } from "react-icons/si";
import { PiShippingContainerFill } from "react-icons/pi";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // To track the current location

  // Use this flag to control if redirection should happen
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("Role");

    if (!storedRole) {
      navigate("/login"); // Redirect to login if role is not set
    } else {
      setRole(storedRole);
    }

    // Redirect only if it's the initial load and user hasn't been redirected yet
    if (!redirected && storedRole) {
      if (storedRole === "admin") {
        navigate("/dashboard");
      } else if (storedRole === "dealer") {
        navigate("/dealerdashboard");
      } else if (storedRole === "consumer") {
        navigate("/userdashboard");
      }
      else if (storedRole === "Independetuser") {
        navigate("/independetdashboard");
      }
      setRedirected(true); // Mark as redirected to prevent further redirections
    }
  }, [navigate, redirected]);

  // Toggle submenu
  const isOpenSubmenu = (tabIndex) => {
    setActiveTab(activeTab === tabIndex ? null : tabIndex); // Toggle submenu
  };

  return (
    <div className="sidebar">
      <ul>
        {/* Common Dashboard for all roles */}
        <li>
          <Link
            to={
              role === "admin"
                ? "/dashboard"
                : role === "dealer"
                ? "/dealerdashboard"
                : role==="consumer"
                
                ? "/userdashboard"
                :"/independetdashboard"
            }
           style= {{textDecoration:"none"}}
          >
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
            <li>
              <Button
                className={`w-100 d-flex justify-content-between align-items-center ${
                  activeTab === 1 ? "active" : ""
                }`}
                onClick={() => isOpenSubmenu(1)}
              >
                <span className="icon">
                  <FaRegUser />
                </span>
                Admin Dealer
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

            <li>
              <Button
                className={`w-100 d-flex justify-content-between align-items-center ${
                  activeTab === 2 ? "active" : ""
                }`}
                onClick={() => isOpenSubmenu(2)}
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

            <li>
              <Button
                className={`w-100 d-flex justify-content-between align-items-center ${
                  activeTab === 4 ? "active" : ""
                }`}
                onClick={() => isOpenSubmenu(4)}
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

            <li>
              <Button
                className={`w-100 d-flex justify-content-between align-items-center ${
                  activeTab === 5 ? "active" : ""
                }`}
                onClick={() => isOpenSubmenu(5)}
                style={{ textDecoration: "none" }}
              >
                <span className="icon">
                  <FaRegListAlt />
                </span>
                Orders
                <span className={`arrow ${activeTab === 5 ? "rotate" : ""}`}>
                  <FaAngleRight />
                </span>
              </Button>
              <div
                className={`submenuWrapper ${
                  activeTab === 5 ? "open" : "collapsed"
                }`}
              >
                <ul className="submenu">
                  <li>
                    <Link to="/dealerorders">Dealer Orders</Link>
                  </li>
                  <li>
                    <Link to="/cuslist">Consumer Orders</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li>
  <Link to="/dealersearning" className="link-button" style={{textDecoration:"none"}}>
    <Button className="w-100 d-flex justify-content-between align-items-center">
      <span className="icon">
        <RxDashboard />
      </span>
      Earning
      <span className="arrow">
        <FaAngleRight />
      </span>
    </Button>
  </Link>
</li>
            <li>
              <Button
                className={`w-100 d-flex justify-content-between align-items-center ${
                  activeTab === 6 ? "active" : ""
                }`}
                onClick={() => isOpenSubmenu(6)}
                style={{ textDecoration: "none" }}
              >
                <span className="icon">
                  <FaRegListAlt />
                </span>
                Blog
                <span className={`arrow ${activeTab === 6 ? "rotate" : ""}`}>
                  <FaAngleRight />
                </span>
              </Button>
              <div
                className={`submenuWrapper ${
                  activeTab === 6 ? "open" : "collapsed"
                }`}
              >
                <ul className="submenu">
                  <li>
                    <Link to="/addblog">Add Blog</Link>
                  </li>
                  <li>
                    <Link to="/viewblog">View Blog</Link>
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
              >
                <span className="icon">
                  <FaRegUser />
                </span>
                Dealer Consumer
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
                </ul>
              </div>
            </li>

            <li>
              <Button
                className={`w-100 d-flex justify-content-between align-items-center ${
                  activeTab === 2 ? "active" : ""
                }`}
                onClick={() => isOpenSubmenu(2)}
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
            <li>
				  <Link to="/products" style={{textDecoration:"none"}}>
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
              <Link to="/history" style={{textDecoration:"none"}}>
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

            <li>
              <Link to="/earning" style={{textDecoration:"none"}}>
                <Button className="w-100 d-flex justify-content-between align-items-center">
                  <span className="icon">
                    <RxDashboard />
                  </span>
                  Earning
                  <span className="arrow">
                    <FaAngleRight />
                  </span>
                </Button>
              </Link>
            </li>
          </>
        )}

        {/* Consumer-specific menu */}
        {role === "consumer" && (
          <>
            <li>
              <Link to="/conproductlist" style={{textDecoration:"none"}}>
                <Button className="w-100 d-flex justify-content-between align-items-center">
                  <span className="icon">
                    <RxDashboard />
                  </span>
                  Consumer Buy Now
                  <span className="arrow">
                    <FaAngleRight />
                  </span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/cushistory">
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

        {/* Independetuser */}

        {role === "Independetuser" && (
          <>
            <li>
              <Link to="/conproductlist" style={{textDecoration:"none"}}>
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
            <li>
              <Link to="/cushistory" style={{textDecoration:"none"}}>
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
      </ul>
    </div>
  );
};

export default Sidebar;