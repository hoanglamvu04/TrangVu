import React, { useState } from "react";
import "../styles/ReviewFeedback.css";

const ReviewFeedback = () => {
  const [orders] = useState([
    {
      id: "ORD12345",
      status: "Hoàn thành",
      items: [
        {
          id: "P001",
          name: "Áo thun cotton",
          size: "M",
          color: "Đen"
        },
        {
          id: "P002",
          name: "Quần jeans ống suông",
          size: "L",
          color: "Xanh"
        }
      ]
    },
    {
      id: "ORD67890",
      status: "Đang giao",
      items: [
        {
          id: "P003",
          name: "Áo sơ mi caro",
          size: "XL",
          color: "Đỏ"
        }
      ]
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(null);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [reviews, setReviews] = useState([]);

  const completedOrders = orders.filter(o => o.status === "Hoàn thành");
  const products = completedOrders.find(o => o.id === selectedOrder)?.items || [];

  const handleSubmit = () => {
    if (!selectedOrder || !selectedProduct || rating === 0 || !comment) return;

    const selected = products.find(p => p.id === selectedProduct);
    const newReview = {
      orderId: selectedOrder,
      productId: selectedProduct,
      productName: selected?.name,
      size: selected?.size,
      color: selected?.color,
      rating,
      comment,
      image,
      date: new Date().toLocaleDateString("vi-VN"),
      status: "Chờ duyệt"
    };

    setReviews([newReview, ...reviews]);
    setSelectedOrder("");
    setSelectedProduct("");
    setRating(0);
    setHoverRating(null);
    setComment("");
    setImage(null);
  };

  return (
    <div className="review-feedback">
      <h2>Đánh Giá và Phản Hồi</h2>

      <div className="review-form">
        <div className="form-row">
          <select value={selectedOrder} onChange={e => setSelectedOrder(e.target.value)}>
            <option value="">-- Chọn mã đơn hàng --</option>
            {completedOrders.map(order => (
              <option key={order.id} value={order.id}>{order.id}</option>
            ))}
          </select>

          <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
            <option value="">-- Chọn sản phẩm --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {`${p.name} - Size ${p.size} - Màu ${p.color}`}
              </option>
            ))}
          </select>
        </div>

        <div className="rating-row">
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={`star ${star <= rating ? "selected" : ""}`}
              onClick={() => setRating(star)}
            >
              {star <= rating ? "⭐" : "☆"}
            </span>
          ))}
        </div>

        <textarea
          placeholder="Viết đánh giá của bạn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))} />

        <button className="submit-btn" onClick={handleSubmit}>Gửi đánh giá</button>
      </div>

      <div className="review-list">
        {reviews.map((rev, idx) => (
          <div key={idx} className="review-item">
            <div className="review-header">
              <strong>{rev.productName}</strong>
              <span>{rev.date}</span>
              <span className={`status-tag ${rev.status.replace(" ", "-").toLowerCase()}`}>{rev.status}</span>
            </div>
            <div className="review-stars">
              {[...Array(rev.rating)].map((_, i) => <span key={i}>⭐</span>)}
            </div>
            <p>{rev.comment}</p>
            {rev.image && <img src={rev.image} alt="attached" className="review-image" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewFeedback;
