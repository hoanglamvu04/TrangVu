import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";
import CollectionModal from "../components/CollectionModal";

const API_URL = "http://localhost:5000";
const ITEMS_PER_PAGE = 30;

const AdminCollection = () => {
  const [collections, setCollections] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showStickyHeader, setShowStickyHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setShowStickyHeader(current < lastScrollTop || current < 10);
      setLastScrollTop(current <= 0 ? 0 : current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  useEffect(() => {
    fetchCollections();
    // eslint-disable-next-line
  }, [statusFilter]);

  const fetchCollections = async () => {
    const url =
      statusFilter === "All"
        ? `${API_URL}/api/collections`
        : `${API_URL}/api/collections?status=${statusFilter}`;
    const res = await axios.get(url);
    setCollections(Array.isArray(res.data) ? res.data : []);
    setCurrentPage(1);
  };

  const filtered = collections.filter((c) => {
    const key = search.trim().toLowerCase();
    const pack = `${c.collectionCode || ""} ${c.name || ""} ${c.slug || ""}`.toLowerCase();
    return pack.includes(key);
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openCreate = () => {
    setEditingRow(null);
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Bạn có chắc muốn xoá bộ sưu tập này không?")) return;
    await axios.delete(`${API_URL}/api/collections/${row._id}`);
    await fetchCollections();
  };

  return (
    <div className="admin-page">
      <div className={`section-header ${showStickyHeader ? "visible" : "hidden"}`}>
        <h2 className="admin-title">Bộ sưu tập</h2>
        <div className="admin-header-controls">
          <input
            type="text"
            placeholder="Tìm theo mã, tên, slug..."
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
          <button className="add-btn" onClick={openCreate}>+ Thêm Bộ Sưu Tập</button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên</th>
            <th>Slug</th>
            <th>Trạng thái</th>
            <th>Kiểu</th>
            <th>Ưu tiên</th>
            <th>Thời gian</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((c) => (
            <tr key={c._id}>
              <td>{c.collectionCode}</td>
              <td>{c.name}</td>
              <td>{c.slug}</td>
              <td>{c.status}</td>
              <td>{c.type}</td>
              <td>{c.priority ?? 0}</td>
              <td>
                {(c.startAt ? new Date(c.startAt).toLocaleString() : "")}
                {c.endAt ? " — " + new Date(c.endAt).toLocaleString() : ""}
              </td>
              <td>
                <button className="btn-edit" onClick={() => openEdit(c)}>Sửa</button>
                <button className="btn-delete" onClick={() => handleDelete(c)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {showModal && (
        <CollectionModal
          initialData={editingRow}
          onClose={() => {
            setShowModal(false);
            setEditingRow(null);
          }}
          onSuccess={fetchCollections}
        />
      )}
    </div>
  );
};

export default AdminCollection;
