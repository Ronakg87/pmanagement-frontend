// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { createProduct } from "../features/productSlice";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import Sidebar from "../components/Sidebar";

// const CreateProduct = () => {
//   const [name, setName] = useState("");
//   const [sku, setSku] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     await dispatch(createProduct({ name, sku, description, category }));
//     toast.success("Product created successfully!");
//     navigate("/products");
//   };

//   const goBack = () => {
//     navigate(-1); // Go back to the previous page
//   };

//   return (
//     <div className="dashboard-container">
//       <Sidebar />
//       <div className="content">
//       <div className="back-button">
//           <button
//               onClick={goBack}
//               className="back_btn"
//             >
//               🔙
//             </button>
//         </div>
//         <div className="form-section">
//         <h2>Create Product</h2>
//         <form onSubmit={handleSubmit}>
//           <label>Name:</label>
//           <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

//           <label>SKU:</label>
//           <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} required />

//           <label>Description:</label>
//           <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

//           <label>Category:</label>
//           <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />

//           <button type="submit">Create Product</button>
//         </form>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default CreateProduct;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../features/productSlice";
import { fetchUsers } from "../features/userSlice";
import { userInfo } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import { CMultiSelect } from '@coreui/react-pro'
import AuthGuard from "../components/AuthGuard";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [logo, setLogo] = useState(null);  // For image upload
  const [assignedTo, setAssignedTo] = useState([]);

  const { users, loading } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    dispatch(userInfo());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!logo) {
      toast.error("Please upload a product logo.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("logo", logo);
    formData.append("assignedTo", JSON.stringify(assignedTo));

    await dispatch(createProduct(formData));
    toast.success("Product created successfully!");
    navigate("/products");
  };

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const goBack = () => {
    navigate(-1);
  };

  // Filter users excluding current user and admin
  const filteredUsers = users?.result?.filter(
    (cuser) => cuser._id !== user?.user?._id && cuser.role !== "admin"
  );

  const options = filteredUsers?.map((user) => ({
    value: user._id,
    label: user.name
  })) || [];

  // Handle selection
  const handleChange = (selected) => {
    const selectedValues = selected.map((item) => item.value);
    setAssignedTo(selectedValues);
  };
  return (
    <AuthGuard>
    <div className="dashboard-container">
      <Sidebar />
      <div className="content">
        <div className="back-button">
          <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", marginRight: "10px" }}>
            🔙
          </button>
        </div>

        <div className="form-section">
          <h2>Create Product</h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label>Name:</label>
            <input type="text" className="input-textbox" value={name} onChange={(e) => setName(e.target.value)} required />

            <label>SKU:</label>
            <input type="text" className="input-textbox" value={sku} onChange={(e) => setSku(e.target.value)} required />

            <label>Description:</label>
            <textarea className="input-textbox" value={description} onChange={(e) => setDescription(e.target.value)} required />

            <label>Category:</label>
            <input type="text" className="input-textbox" value={category} onChange={(e) => setCategory(e.target.value)} required />

            <label>Logo:</label>
            <input type="file" className="input-textbox" onChange={handleFileChange} required />

            {/* <select
              multiple
              value={assignedTo}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions, (option) => option.value);
                setAssignedTo(options);
              }}
              required
            >
              {loading ? (
                <option>Loading...</option>
              ) : (
                filteredUsers?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))
              )}
            </select> */}

            {loading ? (
              <p>Loading...</p>
            ) : (
              <CMultiSelect
                options={options}
                label="Assign To"
                text="Please select users"
                search="global"
                selectionType="tags"
                onChange={handleChange}
                value={assignedTo}
              />
            )}

            <button type="submit" className="submit-btn">Create Product</button>
          </form>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default CreateProduct;


