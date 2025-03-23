import React from "react";
// import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
// import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* <h3>Dashboard</h3> */}
      <ul>
        {/* <li>
          <Link to="/dashboard">Dashboard</Link>
        </li> */}
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        {/* <li>
          <Link to="/users">Users</Link>
        </li> */}
        {localStorage.getItem("role") === 'admin' && 
          <NavLink to="/users" className={({ isActive }) => (isActive ? "active" : "")}>
            Users
          </NavLink>
        }
        {/* <li>
          <Link to="/products">Products</Link>
        </li> */}
        <NavLink to="/products" className={({ isActive }) => (isActive ? "active" : "")}>
          Products
        </NavLink>
      </ul>
    </div>
  );
};

export default Sidebar;
