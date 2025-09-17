import React, { useMemo, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "../styles/ReviewFeedback.css";
import getColorNameFromCode from "../utils/getColorNameFromCode";
import { API_REVIEWS } from "../constants/api";

const API_URL = process.env.REACT_APP_API_URL;

const ReviewFormModal = ({ open, onClose, order, item, onSubmitted }) => {
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  const customerId = customer?._id;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const colorNameOnly = (code) => {
    const name = getColorNameFromCode(code);
    if (name) return name;
    if (code && !String(code).trim().startsWith("#")) return String(code);
    return "-";
  };

  const title = useMemo(() => {
    if (!item) return "Đánh giá sản phẩm";
    return `Đánh giá: ${item.productName}`;
  }, [item]);

  if (!open) return null;

  const handleChooseFile = (e) => {
    const f = e.target.files?.[0];
    setImageFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const handleSubmit = async () => {
    if (!customerId) return alert("Bạn cần đăng nhập.");
    if (!order?._id || !item?.productCode) return alert("Thiếu thông tin đơn hàng / sản phẩm.");
    if (!rating) return alert("Vui lòng chọn số sao.");
    if (!comment.trim()) return alert("Vui lòng nhập nội dung đánh giá.");

    try {
      setSubmitting(true);
      const form = new FormData();
      form.append("customerId", customerId);
      form.append("orderId", order._id);
      form.append("productCode", item.productCode);
      if (item.productDetailCode) form.append("productDetailCode", item.productDetailCode);
      form.append("rating", String(rating));
      form.append("comment", comment);

      // gửi kèm màu/size + tên màu (từ item đã mua)
      if (item.selectedColor) {
        form.append("selectedColor", item.selectedColor);
        const colorName = getColorNameFromCode(item.selectedColor);
        if (colorName) form.append("selectedColorName", colorName);
      }
      if (item.selectedSize) form.append("selectedSize", item.selectedSize);
      if (imageFile) form.append("image", imageFile);

      await axios.post(API_REVIEWS, form, { headers: { "Content-Type": "multipart/form-data" } });

      alert("Gửi đánh giá thành công! (Chờ duyệt)");
      onSubmitted?.();
      onClose?.();
    } catch (err) {
      alert(err.response?.data?.message || "Gửi đánh giá thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rfm-backdrop" onClick={onClose}>
      <div className="rfm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-3">{title}</h3>

        {item && (
          <div className="review-meta">
            <span>Màu: <strong>{colorNameOnly(item.selectedColor)}</strong></span> &nbsp;|&nbsp;
            <span>Size: <strong>{item.selectedSize || "-"}</strong></span>
          </div>
        )}

        <div className="rating-row" style={{ marginTop: 8 }}>
          {[1,2,3,4,5].map(star => (
            <FaStar key={star}
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
          {preview && <img src={preview} alt="preview" className="review-preview" />}
        </div>

        <div className="rfm-actions">
          <button onClick={onClose} className="rfm-cancel">Hủy</button>
          <button onClick={handleSubmit} disabled={submitting} className="rfm-submit">
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewFormModal;
