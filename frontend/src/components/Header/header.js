import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Logo2 from "../../assests/images/Main-logo.png";
import Profile from "../../assests/images/profile.png";
import Button from "@mui/material/Button";
import { MdMenuOpen } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { MdDarkMode, MdOutlineEmail } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import SearchBox from "../searchBox/SearchBox";
import axios from "axios";
import BASE_url  from "./../../config/constants.js";


const Header = ({toggle, settoggle}) => {
  const token = sessionStorage.getItem("Token");
  const role=sessionStorage.getItem('Role');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  //const BASE_URL = "http://localhost:5000";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate=useNavigate();
  // -------------------------logout api-------------------
  const handleLogout = async () => {
    try {
      const url = `${BASE_url}/api/auth/logout` ;
      const requestBody = { token }; 
console.log("request body",requestBody);
      const response = await axios.post(url, requestBody);
      console.log("Response of logout api", response);
      if(response.data.message==="Logged out successfully"){
        navigate('/');
      }
      if (!response.data.error) {
        // Successfully logged out
        sessionStorage.removeItem("Token"); 
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error in Logout api", error);
    }
  };
  function handletoggle(){
    if(toggle=== false){
      settoggle(true);
    }
    else{
      settoggle(false);
    }
  }
 
  // --------------------------------end---------------------

  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center">
            {/* Logo header */}
            <div className="col-9 col-md-9 col-lg-9 part1">
            <div className="row d-flex align-items-center">
              <div className=" col-6 col-md-6 col-lg-6">
              <Link to={"/"} className="logo flex align-items-center justify-content-center">
              
               <img
                      src={Logo2}
                      alt="Header-logo"
                      className="image "
                      style={{ height: "80px",
                        width: "auto",
                        paddingBottom: "18px", }}
                    />
              
              </Link>
              </div>
              <div className="col-3 col-md-3 col-lg-3 d-flex align-items-center justify-content-center part2 hide">
              <Button className="rounded-circle  d-flex align-items-center justify-content center">
                <MdMenuOpen onClick={()=>handletoggle()}/>
              </Button>
              </div>
              </div>
            </div>

            {/* Menu button */}
            
              
             
           

            <div className="col-3 col-md-3 col-lg-3 d-flex align-items-center justify-content-end part3 p-2 ">
              

              <Button
                className="myAcc d-flex align-items-center"
                onClick={handleClick}
              >
                <div className="userImg">
                  <span className="rounded-circle">
                    <img src={Profile} alt="Profile Image" />
                  </span>
                </div>

                <div className="userInfo">
                  <div className="">
                  <h4 className="">
      {role === "admin"
        ? "Admin"
        : role === "dealer"
        ? "Dealer"
        : role === "consumer"
        ? "Consumer"
        : role === "Independetuser"
        ? "User"
        : "Unknown Role"}
    </h4>
                  </div>
                </div>
              </Button>
              
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleClose}>
                  <Avatar /> Profile
                </MenuItem>

                <MenuItem onClick={() => { handleLogout(); handleClose(); }}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
