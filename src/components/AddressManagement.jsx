import React, { useState } from "react";
import AddressPicker from "../components/AddressPicker";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([
    { id: 1, label: "Nhà riêng", address: "Số 18-20/322 Nhân Mỹ - Mỹ Đình 1 - Quận Nam Từ Liêm - TP.Hà Nội." },
    { id: 2, label: "Văn phòng", address: "Km 3 + 350 Đường Phan Trọng Tuệ - Huyện Thanh Trì - TP.Hà Nội" }
  ]);
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAddAddress = () => {
    if (newLabel && newAddress) {
      setAddresses([
        ...addresses,
        { id: Date.now(), label: newLabel, address: newAddress }
      ]);
      resetForm();
    }
  };

  const handleEditAddress = (index) => {
    const current = addresses[index];
    setEditIndex(index);
    setNewLabel(current.label);
    setNewAddress(current.address);
  };

  const handleSaveEdit = () => {
    const updated = [...addresses];
    updated[editIndex] = {
      ...updated[editIndex],
      label: newLabel,
      address: newAddress,
    };
    setAddresses(updated);
    resetForm();
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const resetForm = () => {
    setEditIndex(null);
    setNewLabel("");
    setNewAddress("");
    setProvince("");
    setDistrict("");
    setWard("");
  };

  return (
    <div className="address-management">
      <h2>Quản Lý Địa Chỉ</h2>
      <div className="address-list">
        {addresses.map((addr, index) => (
          <div key={addr.id} className="address-card">
            <div className="address-info">
              <strong>{addr.label}</strong>
              <p>{addr.address}</p>
            </div>
            <div className="anddress-actios">
              <FaEdit className="edit-icon" onClick={() => handleEditAddress(index)} />
              <FaTrash className="delete-icon" onClick={() => handleDeleteAddress(addr.id)} />
            </div>
          </div>
        ))}
      </div>

      <h2>Thêm Địa Chỉ Mới</h2>
      <div className="address-form">
        {/* Ghi chú (Nhà riêng, Văn phòng...) */}
        <input
          type="text"
          placeholder="Ghi chú (Nhà riêng, Văn phòng...)"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />

        {/* Chọn địa chỉ theo thứ tự Tỉnh → Huyện → Xã */}
        <div className="address-picker-row">
          <AddressPicker
            reverseOrder={false}
            onChange={({ ward, district, province }) => {
              setWard(ward);
              setDistrict(district);
              setProvince(province);
              setNewAddress(`${province}, ${district}, ${ward}`);
            }}
          />
        </div>

        {/* Địa chỉ cụ thể như số nhà, ngõ */}
        <input
          type="text"
          placeholder="Nhập địa chỉ cụ thể (số nhà, ngõ...)"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />

        {editIndex !== null ? (
          <button className="save-btn" onClick={handleSaveEdit}>Lưu thay đổi</button>
        ) : (
          <button className="add-btn" onClick={handleAddAddress}><FaPlus /> Thêm Địa Chỉ</button>
        )}
      </div>
    </div>
  );
};

export default AddressManagement;