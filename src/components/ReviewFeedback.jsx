// src/components/ReviewSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "../styles/ReviewFeedback.css";
import { API_ORDERS, API_REVIEWS } from "../constants/api";
import getColorNameFromCode from "../utils/getColorNameFromCode";

const API_URL = process.env.REACT_APP_API_URL;

const itemKey = (it) => `${it.productCode || ""}|${it.productDetailCode || ""}`;

const ReviewSection = ({ productCode }) => {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const customerId = customer?._id;

  // --- gửi đánh giá ---
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedItemKey, setSelectedItemKey] = useState("");

  // auto-fill từ item
  const [selColor, setSelColor] = useState(""); // mã màu (hex)
  const [selSize, setSelSize] = useState("");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // --- xem đánh giá ---
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStar, setSelectedStar] = useState(0);
  const [filterImage, setFilterImage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    const fetch = async () => {
      if (!customerId) return;
      try {
        const res = await axios.get(`${API_ORDERS}/customer/${customerId}`);
        setOrders(res.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, [customerId]);

  const deliveredOrders = useMemo(
    () => orders.filter((o) => o.status === "Delivered"),
    [orders]
  );

  const productsOfSelectedOrder = useMemo(() => {
    const od = deliveredOrders.find((o) => o._id === selectedOrder);
    return od?.items || [];
  }, [selectedOrder, deliveredOrders]);

  // Tìm item theo key
  const selectedItem = useMemo(() => {
    if (!selectedItemKey) return null;
    return (
      productsOfSelectedOrder.find((it) => itemKey(it) === selectedItemKey) ||
      null
    );
  }, [selectedItemKey, productsOfSelectedOrder]);

  // Khi đổi item -> auto fill color/size
  useEffect(() => {
    setSelColor(selectedItem?.selectedColor || selectedItem?.color || "");
    setSelSize(selectedItem?.selectedSize || selectedItem?.size || "");
  }, [selectedItem]);

  // helper: tên màu (không hiển thị mã)
  const colorNameOnly = (code, fallbackDash = true) => {
    const name = getColorNameFromCode(code);
    if (name) return name;
    // nếu code là chữ (vd "Đen") thì hiển thị; nếu là hex -> dấu gạch
    if (code && !String(code).trim().startsWith("#")) return String(code);
    return fallbackDash ? "-" : "";
  };

  const handleChooseFile = (e) => {
    const f = e.target.files?.[0];
    setImageFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const fetchReviews = async () => {
    if (!productCode) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/reviews/product/${productCode}`
      );
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStar, filterImage, reviews.length]);

  const handleSubmit = async () => {
    if (!customerId) return alert("Bạn cần đăng nhập.");
    if (!selectedOrder) return alert("Vui lòng chọn mã đơn hàng.");
    if (!selectedItem) return alert("Vui lòng chọn sản phẩm trong đơn.");
    if (!rating) return alert("Vui lòng chọn số sao.");
    if (!comment.trim()) return alert("Vui lòng nhập nội dung đánh giá.");

    const [productCode_, productDetailCode] = selectedItemKey.split("|");

    try {
      setSubmitting(true);
      const form = new FormData();
      form.append("customerId", customerId);
      form.append("orderId", selectedOrder);
      form.append("productCode", productCode_); // từ item đã chọn
      if (productDetailCode) form.append("productDetailCode", productDetailCode);
      form.append("rating", String(rating));
      form.append("comment", comment);

      // gửi kèm màu/size + tên màu
      if (selColor) {
        form.append("selectedColor", selColor);
        const colorName = getColorNameFromCode(selColor);
        if (colorName) form.append("selectedColorName", colorName);
      }
      if (selSize) form.append("selectedSize", selSize);

      if (imageFile) form.append("image", imageFile);

      await axios.post(API_REVIEWS, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Gửi đánh giá thành công!");
      // reset form
      setSelectedOrder("");
      setSelectedItemKey("");
      setSelColor("");
      setSelSize("");
      setRating(0);
      setComment("");
      setImageFile(null);
      setPreview("");
      // reload list
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Gửi đánh giá thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter + paginate
  const filtered = reviews
    .filter((r) => (selectedStar ? r.rating === selectedStar : true))
    .filter((r) => (filterImage ? !!r.image : true));
  const totalPages = Math.ceil(filtered.length / reviewsPerPage);
  const start = (currentPage - 1) * reviewsPerPage;
  const paginated = filtered.slice(start, start + reviewsPerPage);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const maskName = (name) => {
    if (!name) return "Khách hàng";
    return (
      name[0] +
      "*".repeat(Math.max(0, name.length - 2)) +
      name[name.length - 1]
    );
  };

  return (
    <div className="review-section">
      {/* Cột trái: Gửi đánh giá */}
      <div className="review-form p-4 border rounded-lg shadow-sm">
        <h3 className="mb-3 font-semibold">Gửi Đánh Giá</h3>

        <div className="form-row">
          <select
            value={selectedOrder}
            onChange={(e) => {
              setSelectedOrder(e.target.value);
              setSelectedItemKey("");
              setSelColor("");
              setSelSize("");
            }}
          >
            <option value="">-- Chọn đơn hàng (đã giao) --</option>
            {deliveredOrders.map((o) => (
              <option key={o._id} value={o._id}>
                {o.orderCode}
              </option>
            ))}
          </select>

          <select
            value={selectedItemKey}
            onChange={(e) => setSelectedItemKey(e.target.value)}
            disabled={!selectedOrder}
          >
            <option value="">-- Chọn sản phẩm --</option>
            {productsOfSelectedOrder.map((it, idx) => {
              const colorCode = it.selectedColor || it.color || "";
              const colorText = colorNameOnly(colorCode);
              return (
                <option key={idx} value={itemKey(it)}>
                  {`${it.productName} - Size ${
                    it.selectedSize || it.size || "-"
                  } - Màu ${colorText}`}
                </option>
              );
            })}
          </select>
        </div>

        {/* meta màu/size auto-fill */}
        {selectedItem && (
          <div className="review-meta" style={{ marginTop: 8 }}>
            <span>
              Màu: <strong>{colorNameOnly(selColor)}</strong>
            </span>{" "}
            &nbsp;|&nbsp;
            <span>
              Size: <strong>{selSize || "-"}</strong>
            </span>
          </div>
        )}

        <div className="rating-row">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              color={star <= rating ? "#ffc107" : "#ddd"}
              onClick={() => setRating(star)}
              style={{ cursor: "pointer", fontSize: 20 }}
            />
          ))}
        </div>

        <textarea
          placeholder="Viết đánh giá..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="file-row">
          <input type="file" accept="image/*" onChange={handleChooseFile} />
          {preview && (
            <img src={preview} alt="preview" className="review-preview" />
          )}
        </div>

        <button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </div>

      {/* Cột phải: Xem đánh giá */}
      <div className="product-reviews p-4 border rounded-lg shadow-sm">
        <h3 className="mb-3 font-semibold">Đánh Giá Sản Phẩm</h3>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <>
            <div className="review-summary">
              <span className="avg-rating">{avgRating}</span> trên 5
              <div className="stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar
                    key={i}
                    color={i <= avgRating ? "#ffc107" : "#ddd"}
                  />
                ))}
              </div>
              <span>({reviews.length} đánh giá)</span>
            </div>

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

            {paginated.length === 0 ? (
              <p>Chưa có đánh giá.</p>
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
                    <span>
                      {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p>{r.comment}</p>
                  {r.image && (
                    <img
                      src={`${API_URL}${r.image}`}
                      alt="review"
                      className="review-img"
                    />
                  )}
                </div>
              ))
            )}

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
    </div>
  );
};

export default ReviewSection;
