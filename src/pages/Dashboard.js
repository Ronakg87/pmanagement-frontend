import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/productSlice";
import { fetchUsers } from "../features/userSlice";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import AuthGuard from '../components/AuthGuard';
// import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.users);
  // const { user } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCardClick = () => {
    navigate("/products"); // Redirects to the Products page
  };

  return (
    <AuthGuard>
    <div className="main-container">
      <Sidebar />
      <div className="content-container">
        
        <div className="header">
          <h2>Dashboard</h2>
        </div>
        <div className="stats">
        {localStorage.getItem('role') === "admin" ? 
          <div className="card"
          onClick={handleCardClick}
          style={{ cursor: "pointer" }}>
            <h3>Total Users</h3>
            <p>{users?.result?.length}</p>
          </div> 
        : ""}
          
            <div className="card" 
            onClick={handleCardClick}
            style={{ cursor: "pointer" }}>
              <h3>Total Products</h3>
              <p>{products?.result?.length}</p>
            </div>
          </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default Dashboard;
