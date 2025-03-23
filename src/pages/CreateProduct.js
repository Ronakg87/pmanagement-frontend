import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../features/productSlice";
import { fetchUsers } from "../features/userSlice";
import { userInfo } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import { CMultiSelect } from '@coreui/react-pro'
import AuthGuard from "../components/AuthGuard";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, loading } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(userInfo());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter users excluding current user and admin
  const filteredUsers = users?.result?.filter(
    (cuser) => cuser._id !== user?.user?._id && cuser.role !== "admin"
  );

  const options = filteredUsers?.map((user) => ({
    value: user._id,
    label: user.name
  })) || [];

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    sku: Yup.string().required("SKU is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    // logo: Yup.mixed().required("Product logo is required"),
    // assignedTo: Yup.array().min(1, "Please assign at least one user")
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("sku", values.sku);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("logo", values.logo);
    // formData.append("assignedTo", JSON.stringify(values.assignedTo));

    await dispatch(createProduct(formData));
    toast.success("Product created successfully!");
    navigate("/products");
    setSubmitting(false);
  };

  return (
    <AuthGuard>
      <div className="dashboard-container">
        <Sidebar />
        <div className="content">
          <div className="back-button">
            <button
              onClick={() => navigate(-1)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", marginRight: "10px" }}
            >
              🔙
            </button>
          </div>

          <div className="form-section">
            <h2>Create Product</h2>

            <Formik
              initialValues={{
                name: "",
                sku: "",
                description: "",
                category: "",
                logo: null,
                assignedTo: [],
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values, isSubmitting }) => (
                <Form encType="multipart/form-data">
                  {/* Name */}
                  <label>Name:</label>
                  <Field type="text" name="name" className="input-textbox" />
                  <ErrorMessage name="name" component="div" className="error" />

                  {/* SKU */}
                  <label>SKU:</label>
                  <Field type="text" name="sku" className="input-textbox" />
                  <ErrorMessage name="sku" component="div" className="error" />

                  {/* Description */}
                  <label>Description:</label>
                  <Field as="textarea" name="description" className="input-textbox" />
                  <ErrorMessage name="description" component="div" className="error" />

                  {/* Category */}
                  <label>Category:</label>
                  <Field type="text" name="category" className="input-textbox" />
                  <ErrorMessage name="category" component="div" className="error" />

                  {/* Logo */}
                  <label>Logo:</label>
                  <input
                    type="file"
                    name="logo"
                    className="input-textbox"
                    onChange={(e) => setFieldValue("logo", e.currentTarget.files[0])}
                  />
                  {/* <ErrorMessage name="logo" component="div" className="error" /> */}

                  {/* Assigned To */}
                  {localStorage.getItem('role') === "admin" && (
                    loading ? (
                    <p>Loading...</p>
                  ) : (
                    <CMultiSelect
                      options={options}
                      label="Assign To"
                      search="global"
                      selectionType="tags"
                      onChange={(selected) => {
                        const selectedValues = selected.map((item) => item.value);
                        setFieldValue("assignedTo", selectedValues);
                      }}
                      value={values.assignedTo}
                    />
                  ))
                }
                  {/* <ErrorMessage name="assignedTo" component="div" className="error" /> */}

                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Create Product"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CreateProduct;
