import React, { useState } from "react";
import axios from "axios";
import "../styles/Modal.css";

const API_URL = "http://localhost:5000";

const EditOrderModal = ({ order, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    totalAmount: order.totalAmount || "",
    status: order.status || "Pending",
    createdAt: new Date(order.createdAt).toISOString().substring(0, 10),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/admin/orders/${order._id}`, {
        totalAmount: Number(formData.totalAmount),
        status: formData.status,
        createdAt: formData.createdAt,
      });
      onSuccess(); // load lại danh sách và đóng modal
    } catch (err) {
      alert("Cập nhật đơn hàng thất bại");
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Sửa đơn hàng</h3>
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="number"
            name="totalAmount"
            placeholder="Tổng tiền"
            value={formData.totalAmount}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="createdAt"
            value={formData.createdAt}
            onChange={handleChange}
            required
          />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Chưa xử lý</option>
            <option value="Processing">Đã xác nhận</option>
            <option value="Shipped">Đang giao</option>
            <option value="Delivered">Hoàn thành</option>
            <option value="Cancelled">Bị huỷ</option>
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

export default EditOrderModal;
