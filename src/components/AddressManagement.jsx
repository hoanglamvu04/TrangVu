import React, { useEffect, useState } from "react";
import AddressPicker from "../components/AddressPicker";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
const API_URL = "http://localhost:5000/api/addresses";

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [editId, setEditId] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  const customer = JSON.parse(localStorage.getItem("customer"));
  const customerId = customer?._id;

  useEffect(() => {
    if (customerId) fetchAddresses();
  }, [customerId]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${API_URL}/${customerId}`);
      setAddresses(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy địa chỉ:", err);
    }
  };

  const handleAddAddress = async () => {
    if (!province || !district || !ward || !newDetail || !customerId) return;
    try {
      await axios.post(API_URL, {
        customerId,
        label: newLabel,
        province,
        district,
        ward,
        detail: newDetail,
      });
      fetchAddresses();
      resetForm();
    } catch (err) {
      console.error("Lỗi khi thêm địa chỉ:", err);
    }
  };

  const handleEditAddress = (addr) => {
    setEditId(addr._id);
    setNewLabel(addr.label || "");
    setNewDetail(addr.detail || "");
    setProvince(addr.province || "");
    setDistrict(addr.district || "");
    setWard(addr.ward || "");
  };

  const handleSaveEdit = async () => {
    if (!province || !district || !ward || !newDetail) return;
    try {
      await axios.put(`${API_URL}/${editId}`, {
        label: newLabel,
        province,
        district,
        ward,
        detail: newDetail,
      });
      fetchAddresses();
      resetForm();
    } catch (err) {
      console.error("Lỗi khi cập nhật địa chỉ:", err);
    }
  };

  const handleDeleteAddress = async (id) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xoá địa chỉ này không?");
    if (!confirmed) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error("Lỗi khi xoá địa chỉ:", err);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setNewLabel("");
    setNewDetail("");
    setProvince("");
    setDistrict("");
    setWard("");
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <div className="address-management">
      <h2>Quản Lý Địa Chỉ</h2>
      <div className="address-list">
        {addresses.map((addr) => (
          <div key={addr._id} className="address-card">
            <div className="address-info">
              <strong>{addr.label || "(Không có ghi chú)"}</strong>
              <p>{addr.fullAddress}</p>
            </div>
            <div className="anddress-actios">
              <FaEdit
                className="edit-icon"
                style={{ marginRight: "10px", cursor: "pointer", fontSize: "18px" }}
                onClick={() => handleEditAddress(addr)}
              />
              <FaTrash
                className="delete-icon"
                style={{ cursor: "pointer", fontSize: "18px" }}
                onClick={() => handleDeleteAddress(addr._id)}
              />
            </div>

          </div>
        ))}
      </div>

      <h2>Thêm Địa Chỉ Mới</h2>
      <div className="address-form">
        <input
          type="text"
          placeholder="Ghi chú (Nhà riêng, Văn phòng...)"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />

        <div className="address-picker-row">
          <AddressPicker
            resetTrigger={resetTrigger}
            onChange={({ ward, district, province }) => {
              setWard(ward);
              setDistrict(district);
              setProvince(province);
            }}
          />
        </div>

        <input
          type="text"
          placeholder="Nhập địa chỉ cụ thể (số nhà, ngõ...)"
          value={newDetail}
          onChange={(e) => setNewDetail(e.target.value)}
        />

        {editId ? (
          <button className="save-btn" onClick={handleSaveEdit}>
            Lưu thay đổi
          </button>
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
