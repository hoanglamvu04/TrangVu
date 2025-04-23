import React, { useState } from "react";
import axios from "axios";
import "../styles/Modal.css";

const API_URL = "http://localhost:5000";

const EditUserModal = ({ user, onClose, onSuccess }) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [birthDate, setBirthDate] = useState(
    user.birthDate ? new Date(user.birthDate).toISOString().substring(0, 10) : ""
  );
  const [status, setStatus] = useState(user.status || "Active");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        fullName,
        email,
        phoneNumber,
        birthDate: birthDate || null,
        status,
      };

      await axios.put(`${API_URL}/api/admin/users/${user._id}`, updatedData);
      onSuccess();
    } catch (err) {
      alert("Cập nhật thất bại");
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Sửa thông tin người dùng</h3>
        <form onSubmit={handleSubmit} className="form-container">
          <input
            name="fullName"
            type="text"
            placeholder="Họ tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            name="phoneNumber"
            type="text"
            placeholder="SĐT"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <input
            name="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
            <option value="Pending">Pending</option>
          </select>
          <div className="btn-group">
            <button type="submit" className="add-btn">Cập nhật</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;