import React, { useState } from "react";
import "./Login.css";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaRegUserCircle } from "react-icons/fa";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: "",
      role: "",
      status: "",
    },
    validationSchema: Yup.object(
      isRegister
        ? {
            name: Yup.string().required("Full Name is required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Email is required"),
            password: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .required("Password is required"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password"), null], "Passwords must match")
              .required("Confirm Password is required"),
            dob: Yup.date()
              .required("Date of Birth is required")
              .typeError("Invalid Date format"),
            role: Yup.string().required("Role is required"),
            status: Yup.string().required("Status is required"),
          }
        : {
            email: Yup.string()
              .email("Invalid email address")
              .required("Email is required"),
            password: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .required("Password is required"),
          }
    ),
    onSubmit: async (values) => {
      setError("");
      try {
        if (isRegister) {
          const { name, email, password, dob, role, status } = values;
          const response = await axios.post(
            "http://localhost:5000/api/user/register",
            { name, email, password, dob, role, status }
          );
          alert("Registration successful!");
          formik.resetForm();
          setIsRegister(false);
        } else {
          const { email, password } = values;
          const response = await axios.post(
            "http://localhost:5000/api/user/login",
            { email, password }
          );

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data._id);
          navigate("/home");
        }
      } catch (err) {
        setError(
          err.response?.data?.msg || "An error occurred. Please try again."
        );
      }
    },
  });

  return (
    <div className="yo-body">
      <div className="App">
        <div className="wrapper">
          <form onSubmit={formik.handleSubmit}>
            <h1>
              <FaRegUserCircle className="user" />
            </h1>

            {isRegister && (
              <div className="input-box">
                <FaUserAlt className="icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="error">{formik.errors.name}</div>
                )}
              </div>
            )}

            <div className="input-box">
              <FaUserAlt className="icon" />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.email && formik.errors.email && (
                <div className="error">{formik.errors.email}</div>
              )}
            </div>

            <div className="input-box">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.password && formik.errors.password && (
                <div className="error">{formik.errors.password}</div>
              )}
            </div>

            {isRegister && (
              <div className="input-box">
                <FaLock className="icon" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <div className="error">{formik.errors.confirmPassword}</div>
                  )}
              </div>
            )}

            {isRegister && (
              <div className="input-box">
                <input
                  type="date"
                  name="dob"
                  value={formik.values.dob}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.dob && formik.errors.dob && (
                  <div className="error">{formik.errors.dob}</div>
                )}
              </div>
            )}

            {isRegister && (
              <div className="input-box">
                <FaUserAlt className="icon" />
                <input
                  type="text"
                  placeholder="Role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.role && formik.errors.role && (
                  <div className="error">{formik.errors.role}</div>
                )}
              </div>
            )}

            {isRegister && (
              <div className="input-box">
                <FaUserAlt className="icon" />
                <input
                  type="text"
                  placeholder="Status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.status && formik.errors.status && (
                  <div className="error">{formik.errors.status}</div>
                )}
              </div>
            )}

            <div className="remember-forgot">
              {!isRegister && <a href="#">Forgot password?</a>}
            </div>

            <button type="submit">{isRegister ? "Register" : "Login"}</button>

            <div className="register-link">
              <p>
                {isRegister
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <span
                  style={{ cursor: "pointer", color: " #00c8c8" }}
                  onClick={() => {
                    setIsRegister(!isRegister);
                    formik.resetForm();
                  }}
                >
                  {isRegister ? " Login" : " Register"}
                </span>
              </p>
            </div>

            {error && (
              <div className="error">
                <p>{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
