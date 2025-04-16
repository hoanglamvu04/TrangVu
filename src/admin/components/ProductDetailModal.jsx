import React, { useEffect, useState } from "react";
import axios from "axios";
import ColorPicker from "./ColorPicker";
import '../styles/color-picker.css';
import "../styles/product-detail-modal.css";

const API_URL = "http://localhost:5000";

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductDetailModal = ({ product, onClose }) => {
  const [details, setDetails] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const [form, setForm] = useState({
    colorCode: "",
    colorName: "",
    size: "",
    quantity: "",
    image: null,
  });

  const fetchDetails = async () => {
    const res = await axios.get(`${API_URL}/api/product-details/${product.code}`);
    setDetails(res.data);
  };

  useEffect(() => {
    fetchDetails();
  }, [product]);

  const groupedByColor = details.reduce((acc, cur) => {
    if (!acc[cur.colorCode]) acc[cur.colorCode] = [];
    acc[cur.colorCode].push(cur);
    return acc;
  }, {});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: name === "image" ? files[0] : value });
  };

  const handleEdit = (d) => {
    setEditingDetail(d);
    setForm({ ...d, image: null });
    setSelectedSizes([d.size]);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/api/product-details/${id}`);
    fetchDetails();
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async () => {
    for (const size of selectedSizes) {
      const formData = new FormData();
      formData.append("productCode", product.code);
      formData.append("colorCode", form.colorCode);
      formData.append("colorName", form.colorName);
      formData.append("size", size);
      formData.append("quantity", form.quantity);
      if (form.image) formData.append("image", form.image);
      else if (editingDetail?.image) formData.append("existingImage", editingDetail.image);

      if (editingDetail) {
        await axios.put(`${API_URL}/api/product-details/${editingDetail._id}`, formData);
        break;
      } else {
        await axios.post(`${API_URL}/api/product-details`, formData);
      }
    }

    setShowForm(false);
    setEditingDetail(null);
    setSelectedSizes([]);
    setForm({ colorCode: "", colorName: "", size: "", quantity: "", image: null });
    fetchDetails();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-product-detail" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Chi tiết sản phẩm ({product.code})</h3>

        {Object.keys(groupedByColor).length === 0 ? (
          <p className="no-detail">Chưa có chi tiết nào.</p>
        ) : (
          <div className="color-list">
            {Object.entries(groupedByColor).map(([colorCode, colorDetails]) => (
              <details
                key={colorCode}
                className="color-accordion"
                style={{ backgroundColor: "transparent" }}
              >
                <summary className="color-summary">
                  <span className="color-label" style={{ backgroundColor: colorCode }}>
                    <span className="color-text">{colorDetails[0].colorName}</span>
                    <span className="color-count">{colorDetails.length}</span>
                  </span>
                </summary>
                <table className="color-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Số lượng</th>
                      <th>Hình ảnh</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colorDetails.map((d) => (
                      <tr key={d._id}>
                        <td>{d.size}</td>
                        <td>{d.quantity}</td>
                        <td>
                          {d.image && (
                            <img
                              src={`${API_URL}${d.image}`}
                              alt="ảnh"
                              style={{ width: "50px" }}
                            />
                          )}
                        </td>
                        <td>
                          <button onClick={() => handleEdit(d)} className="btn-edit">Sửa</button>
                          <button onClick={() => handleDelete(d._id)} className="btn-delete">Xoá</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            ))}
          </div>
        )}

        <div className="form-action">
          <button onClick={() => setShowForm(true)} className="btn btn-add">
            Thêm chi tiết
          </button>
        </div>

        {showForm && (
          <div className="form-section">
            <div className="form-group">
              <label>Chọn màu</label>
              <ColorPicker
                onSelect={(color) =>
                  setForm((prev) => ({
                    ...prev,
                    colorCode: color.code,
                    colorName: color.name,
                  }))
                }
              />
            </div>
            <div className="form-group">
              <label>Chọn size (nhiều)</label>
              <div className="multi-size-options">
                {availableSizes.map((size) => (
                  <label
                    key={size}
                    className={`size-option ${selectedSizes.includes(size) ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Số lượng</label>
              <input name="quantity" type="number" value={form.quantity} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Hình ảnh</label>
              <input name="image" type="file" onChange={handleChange} />
            </div>
            <div className="btn-group">
              <button onClick={handleSubmit} className="btn btn-submit">
                {editingDetail ? "Cập nhật" : "Thêm"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingDetail(null);
                  setSelectedSizes([]);
                  setForm({ colorCode: "", colorName: "", size: "", quantity: "", image: null });
                }}
                className="btn btn-cancel"
              >
                Huỷ
              </button>
            </div>
          </div>
        )}

        <button onClick={onClose} className="btn btn-close">
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ProductDetailModal;
