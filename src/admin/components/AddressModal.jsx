import React from "react";
import "../styles/AddressModal.css"; // dùng chung css quản trị

const AddressModal = ({ customerName, address, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Địa chỉ giao hàng</h3>
        <p><strong>Khách hàng:</strong> {customerName}</p>
        <p><strong>Địa chỉ:</strong> {address.fullAddress}</p>
        <p><strong>Số điện thoại:</strong> {address.phoneNumber}</p>
        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
