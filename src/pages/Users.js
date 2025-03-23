import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/authSlice";
import { fetchUsers } from "../features/userSlice";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);


  useEffect(() => {
    if (error === "Access denied") {
      dispatch(logoutUser());
      navigate("/");
    }
  }, [error, dispatch, navigate]);

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
            // style={{
            //   background: "none",
            //   border: "none",
            //   cursor: "pointer",
            //   fontSize: "20px",
            //   marginRight: "10px",
            // }}
          >
            🔙
          </button>
        </div>
        <div className="form-section">
          <h2>Users</h2>
          <Link to="/create-user" className="btn btn-primary">Create User</Link>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users?.result?.length > 0 ? (
                  users?.result?.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-align-center">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default Users;
