import React, { useState, useEffect, useRef } from "react";
import styles from "./home.module.css";
import { IoSettingsSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import profile from "../../images/profile11.png";
import { GoDotFill } from "react-icons/go";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditUser from "./EditUser";
import { useDispatch, useSelector } from "react-redux";

import { SET_USERS } from "../../redux/actions/userAction";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [editEmployeeData, setEditEmployeeData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const employees = useSelector((state) => state.user.Users || []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/all");
        console.log("Response data:", response.data.users);
        dispatch(SET_USERS(response.data.users));
      } catch (error) {
        console.error("Error fetching Employee", error);
      }
    };

    fetchEmployee();
  }, [dispatch]);

  const handleEdit = async (id) => {
    const employeeToEdit = employees.find((emp) => emp._id === id);
    setEditEmployeeData(employeeToEdit);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/delete/${id}`);
      dispatch(SET_USERS(employees.filter((employee) => employee._id !== id)));
      alert("Candidate deleted successfully");
    } catch (error) {
      console.error("Error deleting candidate", error);
      alert("Failed to delete candidate");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/logout"
      );

      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        navigate("/");
      } else {
        throw new Error("Unexpected server response during logout.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      if (error.response) {
        alert(
          error.response.data.message || "Failed to logout. Please try again."
        );
      } else if (error.request) {
        alert("Network error. Please check your internet connection.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.topContainer}>
        <div>
          <div>
            <button
              className={styles.customButton}
              onClick={() => handleLogout()}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <EditUser
          closeDialog={() => {
            setIsDialogOpen(false);
            setEditEmployeeData(null);
          }}
          userData={editEmployeeData}
        />
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Date Created</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={employee._id} className={styles.tableRow}>
                  <td>{index + 1}</td>
                  <td className={styles.profileContainer}>
                    <img
                      className={styles.profile}
                      src={profile}
                      alt="profile"
                    />
                    {employee.name}
                  </td>
                  <td>{formatDate(employee.createdAt)}</td>
                  <td>{employee.role}</td>
                  <td>
                    <GoDotFill className={styles.active} />
                    {employee.status}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(employee._id)}
                      className={styles.actionButton}
                    >
                      <IoSettingsSharp className={styles.settings} />
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className={styles.actionButtonOne}
                    >
                      <MdCancel className={styles.cancel} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className={styles.emptyRow}>
                  No Employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
