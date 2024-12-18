import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./editUser.module.css";
import Cancel from "../../images/cancel.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { SET_USERS } from "../../redux/actions/userAction";

export default function EditUser({ closeDialog, userData }) {
  const [selectedDate, setSelectedDate] = useState(
    userData?.dob ? new Date(userData.dob) : null
  );
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      role: userData?.role || "",
      dob: userData?.dob || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Full Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      role: Yup.string().required("Role is required"),
      dob: Yup.date().nullable().required("Date of Birth is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/user/update/${userData._id}`,
          values
        );

        console.log("Response from server:", response.data);
        dispatch(SET_USERS(response.data.users));
        alert("User updated successfully!");
        closeDialog();
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        alert("Error submitting data. Please try again.");
      }
    },
  });

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    formik.setFieldValue("dob", date.toISOString());
  };

  return (
    <div className={styles.overlay}>
      <dialog className={styles.dialog}>
        <div className={styles.banner}>
          <span style={{ fontSize: "24px", fontWeight: "400" }}>
            Edit User Details
          </span>
          <button onClick={closeDialog} className={styles.closeButton}>
            <img src={Cancel} alt="" />
          </button>
        </div>
        <div className={styles.formContainer}>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.form}>
              <div className={styles.inputField}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  style={{
                    height: "35px",
                    borderRadius: "16px",
                    width: "100%",
                    border: "1px solid #442487",
                  }}
                />
                {formik.touched.name && formik.errors.name && (
                  <span className={styles.errorText}>{formik.errors.name}</span>
                )}
              </div>
              <div className={styles.inputField}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  style={{
                    height: "35px",
                    borderRadius: "16px",
                    width: "100%",
                    border: "1px solid #442487",
                  }}
                />
                {formik.touched.email && formik.errors.email && (
                  <span className={styles.errorText}>
                    {formik.errors.email}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.form}>
              <div className={styles.inputField}>
                <input
                  type="text"
                  name="role"
                  placeholder="Role"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.role}
                  style={{
                    height: "35px",
                    borderRadius: "16px",
                    width: "100%",
                    border: "1px solid #442487",
                  }}
                />
                {formik.touched.role && formik.errors.role && (
                  <span className={styles.errorText}>{formik.errors.role}</span>
                )}
              </div>
              <div
                style={{
                  height: "35px",
                  borderRadius: "16px",
                  width: "100%",
                  marginRight: "2rem",
                  border: "1px solid #442487",
                }}
              >
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateSelect}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Date of Birth"
                  className={styles.dateInput}
                />
                {formik.touched.dob && formik.errors.dob && (
                  <span className={styles.errorText}>{formik.errors.dob}</span>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <button
                type="submit"
                disabled={!formik.isValid || !formik.dirty}
                style={{
                  backgroundColor:
                    formik.isValid && formik.dirty ? " #00c8c8" : "#A4A4A4",
                  height: "38px",
                  width: "212px",
                  borderRadius: "50px",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "500",
                  border: "none",
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
