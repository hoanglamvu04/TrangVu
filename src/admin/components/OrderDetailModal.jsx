import React from "react";
import "../styles/Modal.css";

const OrderDetailModal = ({ order, onClose }) => {
  return (
    <div className="order-modal-overlay">
      <div className="order-modal-content">
        <h3>Chi tiết đơn hàng: {order.orderCode}</h3>
        <table className="order-detail-table">
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Tên SP</th>
              <th>Size</th>
              <th>Màu</th>
              <th>SL</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.productCode}</td>
                <td>{item.productName}</td>
                <td>{item.size}</td>
                <td>{item.color}</td>
                <td>{item.quantity}</td>
                <td>{Number(item.price).toLocaleString()}đ</td>
                <td>{(item.price * item.quantity).toLocaleString()}đ</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="order-btn-group">
          <button className="cancel-btn" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
