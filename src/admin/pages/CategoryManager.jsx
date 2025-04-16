import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css"; // Đã gộp CSS

const API_URL = "http://localhost:5000";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    categoryCode: "",
    name: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      alert("Không thể lấy danh sách danh mục");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/categories/${editingId}`, form);
        alert("Cập nhật danh mục thành công!");
      } else {
        await axios.post(`${API_URL}/api/categories`, form);
        alert("Thêm danh mục thành công!");
      }
      setForm({ categoryCode: "", name: "", description: "", status: "Active" });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      alert("Lỗi xử lý: " + err.message);
    }
  };

  const handleEdit = (cat) => {
    setForm({
      categoryCode: cat.categoryCode,
      name: cat.name,
      description: cat.description,
      status: cat.status,
    });
    setEditingId(cat._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xoá danh mục này?")) {
      try {
        await axios.delete(`${API_URL}/api/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert("Lỗi xoá danh mục");
      }
    }
  };

  return (
    <div className="admin-page">
      <h2>Quản lý danh mục</h2>

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
        ></textarea>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button className="admin-btn btn-submit" onClick={handleSubmit}>
          {editingId ? "Cập nhật" : "Thêm danh mục"}
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.categoryCode}</td>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>{cat.status}</td>
              <td>
                <button className="admin-btn btn-edit" onClick={() => handleEdit(cat)}>Sửa</button>
                <button className="admin-btn btn-delete" onClick={() => handleDelete(cat._id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManager;
