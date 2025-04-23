import React, { useEffect, useState } from "react";
import AddressPicker from "../components/AddressPicker";
import AddressModal from "../components/AddressModal";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import "../styles/address.css";
import "../styles/AddressModal.css";

const API_URL = "http://localhost:5000/api/addresses";

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [editId, setEditId] = useState(null);
  const [editAddressText, setEditAddressText] = useState("");
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);

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

  const isPhoneValid = (phone) => /^0\d{9}$/.test(phone);

  const handleAddAddress = async () => {
    if (!province || !district || !ward || !newDetail || !phoneNumber || !customerId || !isPhoneValid(phoneNumber)) {
      return;
    }
    try {
      await axios.post(API_URL, {
        customerId,
        label: newLabel,
        phoneNumber,
        province,
        district,
        ward,
        detail: newDetail,
      });
      fetchAddresses();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Lỗi khi thêm địa chỉ:", err);
    }
  };

  const handleEditAddress = (addr) => {
    setEditId(addr._id);
    setNewLabel(addr.label || "");
    setNewDetail(addr.detail || "");
    setPhoneNumber(addr.phoneNumber || "");
    setProvince(addr.province || "");
    setDistrict(addr.district || "");
    setWard(addr.ward || "");
    setEditAddressText(`${addr.label || "(Không có ghi chú)"} - ${addr.fullAddress} - SĐT: ${addr.phoneNumber}`);
    setShowForm(true);
  };

  const handleSaveEdit = async () => {
    if (!province || !district || !ward || !newDetail || !phoneNumber || !isPhoneValid(phoneNumber)) {
      return;
    }
    try {
      await axios.put(`${API_URL}/${editId}`, {
        label: newLabel,
        phoneNumber,
        province,
        district,
        ward,
        detail: newDetail,
      });
      fetchAddresses();
      resetForm();
      setShowForm(false);
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
    setPhoneNumber("");
    setProvince("");
    setDistrict("");
    setWard("");
    setPhoneError("");
    setEditAddressText("");
    setResetTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (phoneNumber && !isPhoneValid(phoneNumber)) {
      setPhoneError("Số điện thoại phải bắt đầu bằng số 0 và đủ 10 chữ số.");
    } else {
      setPhoneError("");
    }
  }, [phoneNumber]);

  const isFormValid = province && district && ward && newDetail && isPhoneValid(phoneNumber);

  return (
    <div className="address-management">
      <div className="address-header">
        <h2>Quản Lý Địa Chỉ</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> Thêm Địa Chỉ Mới
        </button>
      </div>

      <div className="address-list">
        {addresses.map((addr) => (
          <div key={addr._id} className="address-card">
            <div className="address-info">
              <strong>{addr.label || "(Không có ghi chú)"}</strong>
              <p>{addr.fullAddress}</p>
              <p>SĐT: {addr.phoneNumber || "Không có"}</p>
            </div>
            <div className="address-actions">
              <FaEdit className="edit-icon" onClick={() => handleEditAddress(addr)} />
              <FaTrash className="delete-icon" onClick={() => handleDeleteAddress(addr._id)} />
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <AddressModal
          isEdit={!!editId}
          onClose={() => { resetForm(); setShowForm(false); }}
          onSave={handleSaveEdit}
          onAdd={handleAddAddress}
          isFormValid={isFormValid}
          newLabel={newLabel}
          newDetail={newDetail}
          phoneNumber={phoneNumber}
          phoneError={phoneError}
          setNewLabel={setNewLabel}
          setNewDetail={setNewDetail}
          setPhoneNumber={setPhoneNumber}
          resetTrigger={resetTrigger}
          province={province}
          district={district}
          ward={ward}
          setProvince={setProvince}
          setDistrict={setDistrict}
          setWard={setWard}
          editAddressText={editAddressText}
        />
      )}
    </div>
  );
};

export default AddressManagement;
