import React, { useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the previously visited page or dashboard
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/,
        "Password must be 8-20 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol"
      ),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await dispatch(loginUser(values));

      if (result.payload) {
        toast.success("Logged in successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <h2 className="login_heading">Login</h2>

            {/* Email Field */}
            <label>Email:</label>
            <Field
              type="email"
              name="email"
              className="input-textbox"
            />
            <ErrorMessage name="email" component="p" className="error" />

            {/* Password Field */}
            <label>Password:</label>
            <Field
              type="password"
              name="password"
              className="input-textbox"
            />
            <ErrorMessage name="password" component="p" className="error" />

            <button type="submit" className="submit-btn" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? "Loading..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
