import React from "react";

import { IoMdSearch } from "react-icons/io";

const SearchBox = () => {
  return (
    <div className="searchBox d-flex align-items-center ">
      <IoMdSearch className="mr-2" />
      <input type="search" placeholder="Search here.." />
    </div>
  );
};

export default SearchBox;
