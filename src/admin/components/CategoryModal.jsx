import React, { useState, useEffect } from "react";
import "../styles/admin.css"; // Sử dụng style chung
import axios from "axios";

const API_URL = "http://localhost:5000";

const CategoryModal = ({ category, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    categoryCode: "",
    name: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    if (category) {
      setForm({
        categoryCode: category.categoryCode || "",
        name: category.name || "",
        description: category.description || "",
        status: category.status || "Active",
      });
    }
  }, [category]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (category) {
        await axios.put(`${API_URL}/api/categories/${category._id}`, form);
        alert("Cập nhật danh mục thành công!");
      } else {
        await axios.post(`${API_URL}/api/categories`, form);
        alert("Thêm danh mục thành công!");
      }
      onSuccess();
    } catch (err) {
      alert("Lỗi xử lý: " + err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.classList.contains("modal-overlay") && onClose()}>
      <div className="modal-content">
        <h3>{category ? "Cập nhật danh mục" : "Thêm danh mục mới"}</h3>

        <div className="admin-form">
          <input
            name="categoryCode"
            value={form.categoryCode}
            placeholder="Mã danh mục"
            onChange={handleChange}
          />
          <input
            name="name"
            value={form.name}
            placeholder="Tên danh mục"
            onChange={handleChange}
          />
          <textarea
            name="description"
            value={form.description}
            placeholder="Mô tả"
            onChange={handleChange}
          />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="modal-actions">
            <button className="admin-btn btn-submit" onClick={handleSubmit}>
              {category ? "Cập nhật" : "Thêm"}
            </button>
            <button className="admin-btn btn-cancel" onClick={onClose}>
              Huỷ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
