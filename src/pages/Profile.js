import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { userInfo } from "../features/authSlice";
import { updateUser } from "../features/userSlice";
import { toast } from "react-toastify";
import AuthGuard from "../components/AuthGuard";
// import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(userInfo());
  }, [dispatch]);

  // Update state when user data is available
  useEffect(() => {
    if (user?.user) {
      setName(user.user.name || "");
      setEmail(user.user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name && !email) {
      toast.error("Please fill the form fileds.");
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to update this profile?");
    if (!confirmed) {
      return;
    }

    const userId = user?.user?._id;

    setLoading(true); // Start loading
    try {
      await dispatch(updateUser({ userId, name, email }));
      toast.success("Profile Updated Successfully.");
    } catch (error) {
      toast.error("Failed to update profile.", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <AuthGuard>
    <div className="profile-container">
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
          <h2>Profile</h2>

          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input
              className="input-textbox"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Email:</label>
            <input
              className="input-textbox"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* <label>Role:</label>
        <input
          type="text"
          value={role}
          disabled
        /> */}

            <button type="submit" className="submit-btn">Update</button>
          </form>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default Profile;
