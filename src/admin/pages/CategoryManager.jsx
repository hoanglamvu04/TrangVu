import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";
import CategoryModal from "../components/CategoryModal";

const API_URL = "http://localhost:5000";
const ITEMS_PER_PAGE = 30;

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setShowHeader(current < lastScrollTop || current < 10);
      setLastScrollTop(current <= 0 ? 0 : current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      alert("Không thể lấy danh sách danh mục");
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setShowModal(true);
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

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.categoryCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || cat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="admin-page">
      <div className={`section-header ${showHeader ? "visible" : "hidden"}`}>
        <h2 className="admin-title">Quản lý danh mục</h2>
        <div className="admin-header-controls">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hoặc tên danh mục..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="admin-search-box"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="admin-filter-dropdown"
          >
            <option value="All">Tất cả</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Inactive">Ngưng hoạt động</option>
          </select>
          <button
            className="add-btn"
            onClick={() => {
              setEditingCategory(null);
              setShowModal(true);
            }}
          >
            + Thêm danh mục
          </button>
        </div>
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
          {paginatedCategories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.categoryCode}</td>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>{cat.status}</td>
              <td>
                <button
                  className="admin-btn btn-edit"
                  onClick={() => handleEdit(cat)}
                >
                  Sửa
                </button>
                <button
                  className="admin-btn btn-delete"
                  onClick={() => handleDelete(cat._id)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal danh mục */}
      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
};

export default CategoryManager;
