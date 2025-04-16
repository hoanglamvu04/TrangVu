import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Modal.css";

const API_URL = "http://localhost:5000";

const AddOrderModal = ({ onClose, onSuccess }) => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer: "",
    items: [],
    totalAmount: 0,
    status: "Pending",
    createdAt: new Date().toISOString().substring(0, 10),
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/users`)
      .then(res => setCustomers(res.data))
      .catch(err => console.error("Lỗi lấy danh sách khách hàng", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/admin/orders`, formData);
      onSuccess();
    } catch (err) {
      alert("Thêm đơn hàng thất bại");
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Thêm đơn hàng</h3>
        <form onSubmit={handleSubmit} className="form-container">
          <select name="customer" onChange={handleChange} required>
            <option value="">Chọn khách hàng</option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>{c.fullName}</option>
            ))}
          </select>
          <input
            type="number"
            name="totalAmount"
            placeholder="Tổng tiền"
            onChange={handleChange}
            required
          />
          <select name="status" onChange={handleChange} value={formData.status}>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <input
            name="createdAt"
            type="date"
            value={formData.createdAt}
            onChange={handleChange}
          />
          <div className="btn-group">
            <button type="submit" className="add-btn">Thêm</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderModal;
