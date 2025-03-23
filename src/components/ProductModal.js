import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, updateProduct, fetchProductById } from "../features/productSlice";
import { fetchUsers } from "../features/userSlice";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CMultiSelect } from "@coreui/react-pro";
// import "./ProductModal.css";  // Add some basic styling

const ProductModal = ({ isOpen, onClose, productId = null }) => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { selectedProduct } = useSelector((state) => state.products);

  const [initialValues, setInitialValues] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    logo: null,
    source: "",
    assignedTo: [],
  });

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    sku: Yup.string().required("SKU is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    source: Yup.string().required("Source is required"),
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchUsers());

      if (productId) {
        dispatch(fetchProductById(productId));
      }
    }
  }, [isOpen, productId, dispatch]);

  useEffect(() => {
    if (productId && selectedProduct?.data) {
      const { name, sku, description, category, logo, source, assignedTo } = selectedProduct.data;
      setInitialValues({
        name,
        sku,
        description,
        category,
        logo,
        source,
        assignedTo: assignedTo || [],
      });
    } else {
      setInitialValues({
        name: "",
        sku: "",
        description: "",
        category: "",
        logo: null,
        source: "",
        assignedTo: [],
      });
    }
  }, [selectedProduct, productId]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("sku", values.sku);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("source", values.source);

    if (values.logo instanceof File) {
      formData.append("logo", values.logo);
    }
    
    formData.append("assignedTo", JSON.stringify(values.assignedTo));

    if (productId) {
      await dispatch(updateProduct({ id: productId, formData }));
      toast.success("Product updated successfully!");
    } else {
      await dispatch(createProduct(formData));
      toast.success("Product created successfully!");
    }

    onClose();
  };

  const handleFileChange = (event, setFieldValue) => {
    setFieldValue("logo", event.currentTarget.files[0]);
  };

  const filteredUsers = users?.result || [];
  const options = filteredUsers.map((user) => ({
    value: user._id,
    label: user.name,
  }));

  const handleAssignChange = (selected, setFieldValue) => {
    const selectedValues = selected.map((item) => item.value);
    setFieldValue("assignedTo", selectedValues);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>{productId ? "Edit Product" : "Create Product"}</h2>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <label>Name:</label>
              <Field type="text" name="name" className="input-textbox" />
              <ErrorMessage name="name" component="div" className="error" />

              <label>SKU:</label>
              <Field type="text" name="sku" className="input-textbox" />
              <ErrorMessage name="sku" component="div" className="error" />

              <label>Description:</label>
              <Field as="textarea" name="description" className="input-textbox" />
              <ErrorMessage name="description" component="div" className="error" />

              <label>Category:</label>
              <Field type="text" name="category" className="input-textbox" />
              <ErrorMessage name="category" component="div" className="error" />

              <label>Source:</label>
              <Field type="text" name="source" className="input-textbox" />
              <ErrorMessage name="source" component="div" className="error" />

              <label>Logo:</label>
              <input
                type="file"
                className="input-textbox"
                onChange={(e) => handleFileChange(e, setFieldValue)}
              />

              {values.logo && !(values.logo instanceof File) && (
                <img
                  src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}/productLogo/${values.logo}`}
                  alt="Product Logo"
                  style={{ width: "120px", height: "150px", objectFit: "cover", marginBottom: "10px" }}
                />
              )}

              {usersLoading ? (
                <p>Loading users...</p>
              ) : (
                <CMultiSelect
                  options={options.map((option) => ({
                    ...option,
                    selected: values.assignedTo.includes(option.value),
                  }))}
                  label="Assign To"
                  text="Please select users"
                  search="global"
                  selectionType="tags"
                  onChange={(selected) => handleAssignChange(selected, setFieldValue)}
                  value={values.assignedTo.map((id) => options.find((user) => user.value === id))}
                />
              )}

              <div className="modal-footer">
                <button type="submit" className="submit-btn">
                  {productId ? "Update" : "Create"}
                </button>
                <button type="button" onClick={onClose} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProductModal;
