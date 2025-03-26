import React, { useState } from "react";
import "../styles/AddressManagement.css";

import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([
    { id: 1, label: "Nhà riêng", address: "Số 18-20/322 Nhân Mỹ - Mỹ Đình 1- Quận Nam Từ Liêm - TP.Hà Nội." },
    { id: 2, label: "Văn phòng", address: "Km 3 + 350 Đường Phan Trọng Tuệ - Huyện Thanh Trì - TP.Hà Nội" }
  ]);

  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAddAddress = () => {
    if (newLabel && newAddress) {
      setAddresses([...addresses, { id: Date.now(), label: newLabel, address: newAddress }]);
      setNewLabel("");
      setNewAddress("");
    }
  };

  const handleEditAddress = (index) => {
    setEditIndex(index);
    setNewLabel(addresses[index].label);
    setNewAddress(addresses[index].address);
  };

  const handleSaveEdit = () => {
    let updatedAddresses = [...addresses];
    updatedAddresses[editIndex] = { ...updatedAddresses[editIndex], label: newLabel, address: newAddress };
    setAddresses(updatedAddresses);
    setEditIndex(null);
    setNewLabel("");
    setNewAddress("");
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  return (
    <div className="address-management">
      <h2>Quản Lý Địa Chỉ</h2>
      <div className="address-list">
        {addresses.length > 0 ? (
          addresses.map((addr, index) => (
            <div key={addr.id} className="address-card">
              <div className="address-info">
                <strong>{addr.label}</strong>
                <p>{addr.address}</p>
              </div>
              <div className="address-actions">
                <FaEdit className="edit-icon" onClick={() => handleEditAddress(index)} />
                <FaTrash className="delete-icon" onClick={() => handleDeleteAddress(addr.id)} />
              </div>
            </div>
          ))
        ) : (
          <p className="no-address">Bạn chưa có địa chỉ nào.</p>
        )}
      </div>

      <div className="address-form">
        <h3>{editIndex !== null ? "Chỉnh Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới"}</h3>
        <input 
          type="text" 
          placeholder="Ghi chú (Nhà riêng, Văn phòng...)" 
          value={newLabel} 
          onChange={(e) => setNewLabel(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Nhập địa chỉ cụ thể..." 
          value={newAddress} 
          onChange={(e) => setNewAddress(e.target.value)} 
        />
        {editIndex !== null ? (
          <button className="save-btn" onClick={handleSaveEdit}>Lưu thay đổi</button>
        ) : (
          <button className="add-btn" onClick={handleAddAddress}>
            <FaPlus /> Thêm Địa Chỉ
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressManagement;
