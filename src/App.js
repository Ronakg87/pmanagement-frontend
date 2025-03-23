// import logo from './logo.svg';
// import './App.css';
import React from "react";
import { Routes, Route, Navigate , useLocation} from "react-router-dom";
import Login from "./pages/Login";
// import AdminDashboard from "./pages/AdminDashboard";
// import UserDashboard from "./pages/UserDashboard";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import Profile from "./pages/Profile";
import EditProduct from "./pages/EditProduct";
// import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

function App() {
  const isAuthenticated = localStorage.getItem("token");

  const location = useLocation();

  return (
    <>
    {location.pathname !== "/" ? <Navbar /> : ""}
      
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/users"
          element={isAuthenticated ? <Users /> : <Navigate to="/" />}
        />
        <Route
          path="/create-user"
          element={isAuthenticated ? <CreateUser /> : <Navigate to="/" />}
        />
        <Route
          path="/products"
          element={isAuthenticated ? <Products /> : <Navigate to="/" />}
        />
        <Route
          path="/create-product"
          element={isAuthenticated ? <CreateProduct /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-product/:id"
          element={isAuthenticated ? <EditProduct /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
        />
        {/* <Route
          path="/admin"
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/user"
          element={isAuthenticated ? <UserDashboard /> : <Navigate to="/" />}
        /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
}

export default App;
