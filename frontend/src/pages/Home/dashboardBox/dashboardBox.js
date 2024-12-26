import React, { useState } from "react";
import PropTypes from "prop-types";
import { HiDotsVertical } from "react-icons/hi";
import Button from "@mui/material/Button";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const DashboardBox = (props) => {
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Destructuring props, including `menuItems`
  const { color, title, value, lastMonthValue, icon, grow, menuItems } = props;

  // Provide default colors if `color` is not passed
  const defaultColor = ["#ff7e5f", "#feb47b"];
  const gradientColor = color || defaultColor;

  return (
    <Button
      className="dashboardBox"
      style={{
        backgroundImage: `linear-gradient(to right, ${gradientColor[0]}, ${gradientColor[1]})`,
      }}
    >
      {grow ? (
        <span className="chart">
          <TrendingUpIcon />
        </span>
      ) : (
        <span className="chart">
          <TrendingDownIcon />
        </span>
      )}
      <div className="d-flex w-100">
        <div className="col1">
          <h4 className="text-white mb-0">{title}</h4>
          <span className="text-white">{value}</span>
        </div>

        <div className="ml-auto">
          <span className="icon">{icon}</span>
        </div>
      </div>

      <div className="d-flex align-items-center w-100 bottomEle">
        {/* <h6 className="text-white mb-0">Last Month</h6> */}
        <span className="text-white">{lastMonthValue}</span>
        <div className="ml-auto">
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "20ch",
                },
              },
            }}
          >
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  item.onClick();
                  handleClose();
                }}
              >
                {item.title}
              </MenuItem>
            ))}
          </Menu>
        </div>
        <Button className="ml-auto toggleIcon" onClick={handleClick}>
          <HiDotsVertical />
        </Button>
      </div>
    </Button>
  );
};

DashboardBox.propTypes = {
  color: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  lastMonthValue: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  icon: PropTypes.node.isRequired,
  grow: PropTypes.bool.isRequired,
};

DashboardBox.defaultProps = {
  color: ["#ff7e5f", "#feb47b"], // Default colors if not provided
};

export default DashboardBox;
