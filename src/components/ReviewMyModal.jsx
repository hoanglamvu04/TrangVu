import React from "react";
import { FaStar } from "react-icons/fa";
import getColorNameFromCode from "../utils/getColorNameFromCode";

const API_URL = process.env.REACT_APP_API_URL;

const ReviewMyModal = ({ open, onClose, review }) => {
  if (!open) return null;

  const colorNameOnly = (code) => {
    const name = getColorNameFromCode(code);
    if (name) return name;
    if (code && !String(code).trim().startsWith("#")) return String(code);
    return "-";
  };

  return (
    <div className="rfm-backdrop" onClick={onClose}>
      <div className="rfm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-3">Đánh giá của bạn</h3>

        {review ? (
          <>
            <div className="review-meta">
              <span>Màu: <strong>{review.selectedColorName || colorNameOnly(review.selectedColor)}</strong></span> &nbsp;|&nbsp;
              <span>Size: <strong>{review.selectedSize || "-"}</strong></span> &nbsp;|&nbsp;
              <span>{new Date(review.createdAt).toLocaleString("vi-VN")}</span>
            </div>

            <div className="rating-row" style={{ marginTop: 8 }}>
              {[1,2,3,4,5].map(i => (
                <FaStar key={i} color={i <= review.rating ? "#ffc107" : "#ddd"} />
              ))}
            </div>

            <p style={{ marginTop: 8 }}>{review.comment}</p>
            {review.image && (
              <img src={`${API_URL}${review.image}`} alt="review" className="review-img" />
            )}
          </>
        ) : (
          <p>Không tìm thấy đánh giá.</p>
        )}

        <div className="rfm-actions">
          <button onClick={onClose} className="rfm-submit">Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewMyModal;
