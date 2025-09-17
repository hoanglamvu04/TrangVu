import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../styles/admin.css";

const API_URL = "http://localhost:5000"; // giống UserManager

const STATUS_LABELS = {
  Pending: "Chờ duyệt",
  Approved: "Đã duyệt",
  Rejected: "Bị từ chối",
  All: "Tất cả",
};

const AdminReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [productCode, setProductCode] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const [actingId, setActingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30;

  useEffect(() => {
    const handleScroll = () => {
      const cur = window.pageYOffset || document.documentElement.scrollTop;
      setShowHeader(cur < lastScrollTop || cur < 10);
      setLastScrollTop(cur <= 0 ? 0 : cur);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/admin/reviews`, {
        params: { status, productCode, q },
      });
      setReviews(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Không tải được danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const onFilterClick = () => {
    setCurrentPage(1);
    fetchReviews();
  };

  const updateStatus = async (id, newStatus) => {
    setActingId(id);
    try {
      await axios.put(`${API_URL}/api/admin/reviews/${id}/status`, { status: newStatus });
      fetchReviews();
    } catch (e) {
      alert(e.response?.data?.message || "Cập nhật trạng thái thất bại");
    } finally {
      setActingId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Xác nhận xoá đánh giá này?")) return;
    setActingId(id);
    try {
      await axios.delete(`${API_URL}/api/admin/reviews/${id}`);
      fetchReviews();
    } catch (e) {
      alert(e.response?.data?.message || "Xoá đánh giá thất bại");
    } finally {
      setActingId(null);
    }
  };

  // tìm kiếm phía client (bổ sung) theo comment/khách/mã đơn khi cần
  const localSearch = (list) => {
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (r) =>
        r.comment?.toLowerCase().includes(s) ||
        r.customer?.fullName?.toLowerCase().includes(s) ||
        r.order?.orderCode?.toLowerCase().includes(s)
    );
  };

  const filtered = useMemo(() => localSearch(reviews), [reviews, q]);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const counts = useMemo(() => {
    const c = { Pending: 0, Approved: 0, Rejected: 0 };
    reviews.forEach((r) => (c[r.status] = (c[r.status] || 0) + 1));
    return c;
  }, [reviews]);

  return (
    <div className="admin-page">
      {/* header cố định sử dụng class chung */}
      <div className={`section-header ${showHeader ? "visible" : "hidden"}`}>
        <h2 className="admin-title">Quản lý đánh giá sản phẩm</h2>
        <div className="admin-header-controls">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="admin-search-box"
            style={{ maxWidth: 200 }}
          >
            {["Pending", "Approved", "Rejected", "All"].map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Lọc theo mã sản phẩm (vd: atn4)"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            className="admin-search-box"
            style={{ maxWidth: 220 }}
          />

          <input
            type="text"
            placeholder="Tìm trong bình luận / KH / mã đơn"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setCurrentPage(1);
            }}
            className="admin-search-box"
            style={{ maxWidth: 260 }}
          />

          <button className="add-btn" onClick={onFilterClick}>
            Lọc
          </button>
        </div>
      </div>

      {/* tóm tắt trạng thái dùng style chung */}
      <div style={{ margin: "12px 0", display: "flex", gap: 16 }}>
        <span>Chờ duyệt: {counts.Pending || 0}</span>
        <span>Đã duyệt: {counts.Approved || 0}</span>
        <span>Bị từ chối: {counts.Rejected || 0}</span>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Sao</th>
              <th>Nội dung</th>
              <th>Ảnh</th>
              <th>Trạng thái</th>
              <th>Ngày</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((r) => (
              <tr key={r._id}>
                <td>
                  <div style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{r.productCode}</div>
                  {r.productDetailCode && (
                    <div style={{ color: "#888", fontSize: 12 }}>({r.productDetailCode})</div>
                  )}
                </td>
                <td>
                  <div style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
                    {r.order?.orderCode || "—"}
                  </div>
                  <div style={{ color: "#888", fontSize: 12 }}>{r.order?.status}</div>
                </td>
                <td>
                  {r.customer?.fullName || "Khách"}
                  <br />
                  <span style={{ color: "#888", fontSize: 12 }}>{r.customer?.email}</span>
                </td>
                <td>{"⭐".repeat(r.rating || 0)}</td>
                <td style={{ maxWidth: 320, whiteSpace: "pre-wrap" }}>{r.comment}</td>
                <td>
                  {r.image ? (
                    <a href={`${API_URL}${r.image}`} target="_blank" rel="noreferrer">
                      <img
                        src={`${API_URL}${r.image}`}
                        alt="review"
                        width="64"
                        height="64"
                        style={{ objectFit: "cover", borderRadius: 6 }}
                      />
                    </a>
                  ) : (
                    <span style={{ color: "#888" }}>—</span>
                  )}
                </td>
                <td>
                  <span
                    className={`admin-badge ${
                      (r.status || "").toLowerCase()
                    }`}
                  >
                    {STATUS_LABELS[r.status] || r.status}
                  </span>
                </td>
                <td>{new Date(r.createdAt).toLocaleString("vi-VN")}</td>
                <td>
                  {/* dùng class chung của bạn cho nút */}
                  {r.status !== "Approved" && (
                    <button
                      className="admin-btn btn-edit"
                      onClick={() => updateStatus(r._id, "Approved")}
                      disabled={actingId === r._id}
                    >
                      {actingId === r._id ? "Đang xử lý..." : "Duyệt"}
                    </button>
                  )}{" "}
                  {r.status !== "Rejected" && (
                    <button
                      className="admin-btn btn-lock"
                      onClick={() => updateStatus(r._id, "Rejected")}
                      disabled={actingId === r._id}
                    >
                      {actingId === r._id ? "Đang xử lý..." : "Từ chối"}
                    </button>
                  )}{" "}
                  <button
                    className="admin-btn btn-delete"
                    onClick={() => remove(r._id)}
                    disabled={actingId === r._id}
                  >
                    {actingId === r._id ? "..." : "Xoá"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
    </div>
  );
};

export default AdminReviewManagement;
