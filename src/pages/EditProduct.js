import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct, fetchProductById } from "../features/productSlice";
import { fetchUsers } from "../features/userSlice";
import { userInfo } from "../features/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import { CMultiSelect } from '@coreui/react-pro';
import AuthGuard from "../components/AuthGuard";

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the product ID from the route

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [logo, setLogo] = useState(null); // For image upload
  const [source, setSource] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);

  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);
  const { product, loading: productLoading } = useSelector((state) => state.products);
  const selectedProduct = useSelector((state) => state.products.selectedProduct);

  useEffect(() => {
    dispatch(userInfo());
    dispatch(fetchUsers());
    dispatch(fetchProductById(id)); // Fetch the product details by ID
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct?.data) {
      setName(selectedProduct?.data?.name);
      setSku(selectedProduct?.data?.sku);
      setDescription(selectedProduct?.data?.description);
      setCategory(selectedProduct?.data?.category);
      setLogo(selectedProduct?.data?.logo);
      setSource(selectedProduct?.data?.source);
      setAssignedTo(selectedProduct?.data?.assignedTo || []);
    }
  }, [product, selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("description", description);
    formData.append("category", category);
    if (logo instanceof File) formData.append("logo", logo); // Add the logo only if it's a new file
    formData.append("source", source);
    formData.append("assignedTo", JSON.stringify(assignedTo));
    
    await dispatch(updateProduct({ id, formData }));
    toast.success("Product updated successfully!");
    navigate("/products");
  };

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]); // Update the logo with the uploaded file
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

  const preSelectedUsers = assignedTo?.map((id) =>
    options.find((user) => user.value === id)
  );
  
  // Handle selection
  const handleChange = (selected) => {
    const selectedValues = selected.map((item) => item.value);
    setAssignedTo(selectedValues);
  };

  if (productLoading) return <p>Loading product details...</p>;

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
            <h2>Edit Product</h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <label>Name:</label>
              <input type="text" className="input-textbox" value={name} onChange={(e) => setName(e.target.value)} required />

              <label>SKU:</label>
              <input type="text" className="input-textbox" value={sku} onChange={(e) => setSku(e.target.value)} required />

              <label>Description:</label>
              <textarea className="input-textbox" value={description} onChange={(e) => setDescription(e.target.value)} required />

              <label>Category:</label>
              <input type="text" className="input-textbox" value={category} onChange={(e) => setCategory(e.target.value)} required />

              <label>Source:</label>
              <input type="text" className="input-textbox" value={source} onChange={(e) => setSource(e.target.value)} style={{background: "#e8ecf1"}}  readOnly/>

              <label>Logo:</label>
              {logo && !(logo instanceof File) && (
                <img
                  src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}/productLogo/${logo}`}
                  alt="Product Logo"
                  style={{ width: "120px", height: "150px", objectFit: "cover", marginBottom: "10px" }}
                />
              )}
              <input type="file" className="input-textbox" onChange={handleFileChange} />

              {localStorage.getItem('role') === "admin" && (
              usersLoading ? (
                <p>Loading users...</p>
              ) : (
                <CMultiSelect
                options={options.map((option) => ({
                    ...option,
                    selected: preSelectedUsers?.some((user) => user.value === option.value),
                  }))}
                  label="Assign To"
                  search="global"
                  selectionType="tags"
                  onChange={handleChange}
                  value={preSelectedUsers} // Pre-select users
                />
              ))}

              <button type="submit" className="submit-btn">Update Product</button>
            </form>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default EditProduct;
