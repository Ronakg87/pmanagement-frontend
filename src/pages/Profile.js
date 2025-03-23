import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { userInfo } from "../features/authSlice";
import { updateUser } from "../features/userSlice";
import { toast } from "react-toastify";
import AuthGuard from "../components/AuthGuard";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(userInfo());
  }, [dispatch]);

  const initialValues = {
    name: user?.user?.name || "",
    email: user?.user?.email || "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name can't exceed 50 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const confirmed = window.confirm("Are you sure you want to update this profile?");
    if (!confirmed) {
      setSubmitting(false);
      return;
    }

    const userId = user?.user?._id;

    try {
      await dispatch(updateUser({ userId, ...values }));
      toast.success("Profile Updated Successfully.");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <AuthGuard>
      <div className="profile-container">
        <Sidebar />
        <div className="content">
          <div className="back-button">
            <button onClick={goBack} className="back_btn">🔙</button>
          </div>
          <div className="form-section">
            <h2>Profile</h2>

            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form> {/* ✅ Use Formik's <Form> instead of <form> */}
                  <label>Name:</label>
                  <Field
                    className="input-textbox"
                    type="text"
                    name="name"
                  />
                  <ErrorMessage name="name" component="p" className="error" />

                  <label>Email:</label>
                  <Field
                    className="input-textbox"
                    type="email"
                    name="email"
                  />
                  <ErrorMessage name="email" component="p" className="error" />

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting || loading ? "Updating..." : "Update"}
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

export default Profile;
