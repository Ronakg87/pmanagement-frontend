import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import AuthGuard from "../components/AuthGuard";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createUser({ name, email, password, role: "user" }));
    toast.success("User created successfully!");
    navigate("/users");
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
          <button
              onClick={goBack}
              className="back_btn"
            >
              🔙
            </button>
        </div>
        <div className="form-section">
          <h2>Create User</h2>
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input type="text" className="input-textbox" value={name} onChange={(e) => setName(e.target.value)} required />

            <label>Email:</label>
            <input type="email" className="input-textbox" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Password:</label>
            <input type="password" className="input-textbox" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <button type="submit" className="submit-btn">Create User</button>
          </form>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default CreateUser;
