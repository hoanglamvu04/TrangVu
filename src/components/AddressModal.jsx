import React from "react";
import AddressPicker from "./AddressPicker";
import "../styles/AddressModal.css";
import { FaPlus } from "react-icons/fa";

const AddressModal = ({
  isEdit,
  onClose,
  onSave,
  onAdd,
  isFormValid,
  newLabel,
  newDetail,
  phoneNumber,
  phoneError,
  setNewLabel,
  setNewDetail,
  setPhoneNumber,
  resetTrigger,
  province,
  district,
  ward,
  setProvince,
  setDistrict,
  setWard,
  editAddressText,
}) => {
  return (
    <div className="address-modal-overlay">
      <div className="address-modal">
        <h3>{isEdit ? "Chỉnh sửa địa chỉ" : "Thêm Địa Chỉ Mới"}</h3>

        {isEdit && (
          <div
            style={{
              backgroundColor: "#f3f3f3",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          >
            <strong>Địa chỉ cũ:</strong> {editAddressText}
          </div>
        )}

        <input
          type="text"
          placeholder="Tên Người Nhận"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />

        <div className="address-picker-row">
          <AddressPicker
            resetTrigger={resetTrigger}
            initialProvince={province}
            initialDistrict={district}
            initialWard={ward}
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

        <input
          type="text"
          placeholder="Số điện thoại liên hệ"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {phoneError && <p style={{ color: "red", fontSize: "13px" }}>{phoneError}</p>}

        <div className="modal-buttons">
          {isEdit ? (
            <button className="save-btn" disabled={!isFormValid} onClick={onSave}>
              Lưu thay đổi
            </button>
          ) : (
            <button className="add-btn" disabled={!isFormValid} onClick={onAdd}>
              <FaPlus /> Thêm Địa Chỉ
            </button>
          )}
          <button className="cancel-btn" onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
