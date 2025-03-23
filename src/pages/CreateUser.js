import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import AuthGuard from "../components/AuthGuard";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validation function
  const validate = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          errorMsg = "Name is required.";
        }
        break;

      case "email":
        if (!value) {
          errorMsg = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMsg = "Invalid email format.";
        }
        break;

      case "password":
        const strongPasswordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
        if (!value) {
          errorMsg = "Password is required.";
        } else if (!strongPasswordRegex.test(value)) {
          errorMsg =
            "Password must be 8-20 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol.";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  // Handle input changes and apply validation in real-time
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update formData state
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate on change
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform final validation before submitting
    Object.keys(formData).forEach((field) => validate(field, formData[field]));

    // Check if any errors exist
    if (Object.values(errors).some((error) => error)) return;

    const result = await dispatch(
      createUser({ ...formData, role: "user" })
    );
    
    if(result.type === "users/createUser/fulfilled"){
      toast.success("User created successfully!");
      navigate("/users");
    }else{
      toast.error(result.payload.msg);
    }
    
  };

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <AuthGuard>
      <div className="dashboard-container">
        <Sidebar />
        <div className="content">
          <div className="back-button">
            <button onClick={goBack} className="back_btn">
              🔙
            </button>
          </div>
          <div className="form-section">
            <h2>Create User</h2>
            <form onSubmit={handleSubmit}>
              
              {/* Name Field */}
              <label>Name:</label>
              <input
                type="text"
                name="name"
                className="input-textbox"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="error">{errors.name}</p>}

              {/* Email Field */}
              <label>Email:</label>
              <input
                type="email"
                name="email"
                className="input-textbox"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}

              {/* Password Field */}
              <label>Password:</label>
              <input
                type="password"
                name="password"
                className="input-textbox"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="error">{errors.password}</p>}

              <button type="submit" className="submit-btn">
                Create User
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CreateUser;
