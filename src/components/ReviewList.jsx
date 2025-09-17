import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "../styles/ReviewFeedback.css";
import getColorNameFromCode from "../utils/getColorNameFromCode";

const API_URL = process.env.REACT_APP_API_URL;

const STATUS_LABELS = {
  Pending: "Chờ duyệt",
  Approved: "Đã duyệt",
  Rejected: "Từ chối",
  All: "Tất cả",
};

const ReviewList = ({ productCode, isAdmin = false }) => {
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  const adminCustomerCode = customer?.customerCode; // gửi header x-customer-code khi là admin

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // filter chung
  const [selectedStar, setSelectedStar] = useState(0);
  const [filterImage, setFilterImage] = useState(false);

  // phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // filter riêng cho admin
  const [admStatus, setAdmStatus] = useState("Pending");
  const [admSearch, setAdmSearch] = useState("");

  const colorNameOnly = (code) => {
    const name = getColorNameFromCode(code);
    if (name) return name;
    if (code && !String(code).trim().startsWith("#")) return String(code);
    return "-";
  };

  const fetchReviews = async () => {
    if (!productCode) return;
    try {
      setLoading(true);
      if (isAdmin) {
        const res = await axios.get(`${API_URL}/api/admin/reviews`, {
          params: { status: admStatus, productCode, q: admSearch },
          headers: { "x-customer-code": adminCustomerCode },
        });
        setReviews(res.data || []);
      } else {
        // người dùng: chỉ hiển thị đã duyệt
        const res = await axios.get(`${API_URL}/api/reviews/product/${productCode}`);
        setReviews(res.data || []);
      }
    } catch (err) {
      console.error("Lỗi khi tải đánh giá:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [productCode]);
  useEffect(() => { if (isAdmin) fetchReviews(); }, [isAdmin, admStatus]); // admin đổi trạng thái -> reload
  useEffect(() => { setCurrentPage(1); }, [selectedStar, filterImage, reviews.length]);

  const filtered = useMemo(() => {
    return (reviews || [])
      .filter((r) => (selectedStar ? r.rating === selectedStar : true))
      .filter((r) => (filterImage ? !!r.image : true));
  }, [reviews, selectedStar, filterImage]);

  const totalPages = Math.ceil(filtered.length / reviewsPerPage);
  const start = (currentPage - 1) * reviewsPerPage;
  const paginated = filtered.slice(start, start + reviewsPerPage);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // ==== ADMIN ACTIONS ====
  const [replyDraft, setReplyDraft] = useState({});

  const sendReply = async (id, content) => {
    if (!content?.trim()) return;
    try {
      await axios.post(
        `${API_URL}/api/admin/reviews/${id}/replies`,
        { content },
        { headers: { "x-customer-code": adminCustomerCode } }
      );
      setReplyDraft((s) => ({ ...s, [id]: "" }));
      fetchReviews();
    } catch (e) {
      alert(e.response?.data?.message || "Gửi phản hồi thất bại");
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Xóa đánh giá này?")) return;
    try {
      await axios.delete(`${API_URL}/api/admin/reviews/${id}`, {
        headers: { "x-customer-code": adminCustomerCode },
      });
      fetchReviews();
    } catch (e) {
      alert(e.response?.data?.message || "Xóa thất bại");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/reviews/${id}/status`,
        { status },
        { headers: { "x-customer-code": adminCustomerCode } }
      );
      fetchReviews();
    } catch (e) {
      alert(e.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  };

  const maskName = (name) => {
    if (!name) return "Khách hàng";
    return name[0] + "***";
  };

  return (
    <div className="product-reviews">
      <h3 className="mb-3 font-semibold">ĐÁNH GIÁ SẢN PHẨM</h3>

      {/* Thanh lọc riêng cho ADMIN */}
      {isAdmin && (
        <div className="review-filters" style={{ marginBottom: 8 }}>
          {["Pending", "Approved", "Rejected", "All"].map((s) => (
            <button
              key={s}
              className={admStatus === s ? "active" : ""}
              onClick={() => setAdmStatus(s)}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
          <input
            className="review-search-input"
            placeholder="Tìm bình luận/khách/mã đơn…"
            value={admSearch}
            onChange={(e) => setAdmSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchReviews()}
            style={{ flex: 1, minWidth: 200 }}
          />
          <button onClick={fetchReviews}>Lọc</button>
        </div>
      )}

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          {/* Tóm tắt */}
          <div className="review-summary">
            <span className="avg-rating">{avgRating}</span> trên 5
            <div className="stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <FaStar key={i} color={i <= avgRating ? "#ffc107" : "#ddd"} />
              ))}
            </div>
            <span>({reviews.length} đánh giá)</span>
          </div>

          {/* Bộ lọc chung */}
          <div className="review-filters">
            <button
              className={selectedStar === 0 ? "active" : ""}
              onClick={() => setSelectedStar(0)}
            >
              Tất cả
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                className={selectedStar === star ? "active" : ""}
                onClick={() => setSelectedStar(star)}
              >
                {star} Sao
              </button>
            ))}
            <button
              className={filterImage ? "active" : ""}
              onClick={() => setFilterImage(!filterImage)}
            >
              Có hình ảnh
            </button>
          </div>

          {/* Danh sách */}
          {paginated.length === 0 ? (
            <p>Không có đánh giá phù hợp.</p>
          ) : (
            paginated.map((r) => (
              <div key={r._id} className="review-card">
                <div className="review-header">
                  <strong>{maskName(r.customer?.fullName)}</strong>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FaStar
                        key={i}
                        color={i <= r.rating ? "#ffc107" : "#ddd"}
                      />
                    ))}
                  </div>
                </div>

                <div className="review-meta">
                  <span>
                    Màu: {r.selectedColorName || colorNameOnly(r.selectedColor)}
                  </span>{" "}
                  | <span>Size: {r.selectedSize || "-"}</span> |{" "}
                  <span>{new Date(r.createdAt).toLocaleDateString("vi-VN")}</span>
                  {isAdmin && r.status && (
                    <>
                      {" "}
                      |{" "}
                      <span style={{ color: "#6b7280" }}>
                        {STATUS_LABELS[r.status] || r.status}
                      </span>
                    </>
                  )}
                </div>

                <p>{r.comment}</p>
                {r.image ? (
                  <img
                    src={`${API_URL}${r.image}`}
                    alt="review"
                    className="review-img"
                  />
                ) : null}

                {/* PHẢN HỒI CỦA SHOP - công khai */}
                {Array.isArray(r.adminReplies) && r.adminReplies.length > 0 && (
                  <div className="review-replies">
                    {r.adminReplies.map((rep, i) => (
                      <div key={i} className="reply">
                        <div className="reply-header">
                          <span className="reply-avatar">
                            {(rep.adminCode || "S").slice(0, 1).toUpperCase()}
                          </span>
                          <div className="reply-meta">
                            <span className="reply-name">
                              {rep.adminCode || "Shop"}
                              <span className="reply-badge">
                                Phản hồi từ shop
                              </span>
                            </span>
                            <span className="reply-time">
                              {new Date(rep.createdAt).toLocaleString("vi-VN")}
                            </span>
                          </div>
                        </div>
                        <div className="reply-body">{rep.content}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ADMIN TOOLS */}
                {isAdmin && (
                  <div className="admin-actions" style={{ marginTop: 8 }}>
                    <div className="admin-quick">
                      {r.status !== "Approved" && (
                        <button
                          onClick={() => updateStatus(r._id, "Approved")}
                        >
                          Duyệt
                        </button>
                      )}
                      {r.status !== "Rejected" && (
                        <button
                          onClick={() => updateStatus(r._id, "Rejected")}
                        >
                          Từ chối
                        </button>
                      )}
                      <button onClick={() => deleteReview(r._id)}>Xóa</button>
                    </div>

                    <div className="admin-reply">
                      <input
                        type="text"
                        placeholder="Phản hồi tới khách..."
                        value={replyDraft[r._id] || ""}
                        onChange={(e) =>
                          setReplyDraft((s) => ({
                            ...s,
                            [r._id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          sendReply(r._id, replyDraft[r._id])
                        }
                      />
                      <button
                        onClick={() => sendReply(r._id, replyDraft[r._id])}
                      >
                        Gửi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList;
