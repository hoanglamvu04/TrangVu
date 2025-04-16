import React, { useState } from "react";
import axios from "axios";
import "../styles/Modal.css";

const API_URL = "http://localhost:5000";

const AddUserModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    birthDate: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/admin/users`, formData);
      onSuccess();
    } catch (err) {
      alert("Thêm người dùng thất bại");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Thêm người dùng</h3>
        <form onSubmit={handleSubmit} className="form-container">
          <input name="fullName" placeholder="Họ tên" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" placeholder="Mật khẩu" type="password" onChange={handleChange} required />
          <input name="phoneNumber" placeholder="SĐT" onChange={handleChange} required />
          <input name="birthDate" type="date" onChange={handleChange} />
          <select name="status" onChange={handleChange} value={formData.status}>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
            <option value="Pending">Pending</option>
          </select>
          <div className="btn-group">
            <button type="submit" className="add-btn">Thêm</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
