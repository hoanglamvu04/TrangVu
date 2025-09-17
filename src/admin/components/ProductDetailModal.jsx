// components/ProductDetailModal.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";
import ColorPicker from "./ColorPicker";
import "../styles/color-picker.css";
import "../styles/product-detail-modal.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductDetailModal = ({ product, onClose }) => {
  const [details, setDetails] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // form state
  const [form, setForm] = useState({
    colorCode: "",
    colorName: "",
    quantity: "",
  });

  // ảnh mới chọn/kéo-thả (File[])
  const [newFiles, setNewFiles] = useState([]);
  // ảnh đang có (URL tương đối từ server)
  const [keepImages, setKeepImages] = useState([]); // dùng khi edit để giữ lại ảnh cũ

  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const fetchDetails = async () => {
    const res = await axios.get(`${API_URL}/api/product-details/${product.code}`);
    setDetails(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // Gom theo màu
  const groupedByColor = useMemo(() => {
    return details.reduce((acc, cur) => {
      if (!acc[cur.colorCode]) acc[cur.colorCode] = [];
      acc[cur.colorCode].push(cur);
      return acc;
    }, {});
  }, [details]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (d) => {
    setEditingDetail(d);
    setForm({
      colorCode: d.colorCode,
      colorName: d.colorName,
      quantity: d.quantity,
    });
    setSelectedSizes([d.size]);
    // nếu API cũ trả d.image (string) thì chuyển thành mảng; còn mới là d.images (array)
    const imgs = Array.isArray(d.images) ? d.images : d.image ? [d.image] : [];
    setKeepImages(imgs);
    setNewFiles([]);
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

  // --- Upload zone (kéo & thả + chọn nhiều) ---
  const onPickFiles = (e) => {
    const fs = Array.from(e.target.files || []);
    if (fs.length) setNewFiles((prev) => [...prev, ...fs]);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const fs = Array.from(e.dataTransfer.files || []).filter((f) => /^image\//.test(f.type));
    if (fs.length) setNewFiles((prev) => [...prev, ...fs]);
  }, []);

  const removeNewFile = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeKeepImage = (url) => {
    setKeepImages((prev) => prev.filter((u) => u !== url));
  };

  const handleSubmit = async () => {
    if (!form.colorCode || selectedSizes.length === 0) {
      alert("Vui lòng chọn màu và ít nhất một size.");
      return;
    }
    if (!form.quantity || Number(form.quantity) < 0) {
      alert("Vui lòng nhập số lượng hợp lệ.");
      return;
    }

    // Với EDIT: chỉ gửi 1 size (đang sửa đúng 1 dòng)
    const sizesToSubmit = editingDetail ? selectedSizes.slice(0, 1) : selectedSizes;

    for (const size of sizesToSubmit) {
      const fd = new FormData();
      fd.append("productCode", product.code);
      fd.append("colorCode", form.colorCode);
      fd.append("colorName", form.colorName);
      fd.append("size", size);
      fd.append("quantity", form.quantity);

      // ảnh mới (nhiều)
      newFiles.forEach((f) => fd.append("images", f));

      if (editingDetail) {
        // giữ lại ảnh cũ (danh sách URL tương đối)
        fd.append("existingImages", JSON.stringify(keepImages));
        // mặc định append (replaceImages="0")
        fd.append("replaceImages", "0");

        await axios.put(`${API_URL}/api/product-details/${editingDetail._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        break; // edit chỉ 1 bản ghi
      } else {
        await axios.post(`${API_URL}/api/product-details`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    }

    // reset
    setShowForm(false);
    setEditingDetail(null);
    setSelectedSizes([]);
    setForm({ colorCode: "", colorName: "", quantity: "" });
    setNewFiles([]);
    setKeepImages([]);
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
              <details key={colorCode} className="color-accordion" style={{ backgroundColor: "transparent" }}>
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
                    {colorDetails.map((d) => {
                      const imgs = Array.isArray(d.images) ? d.images : d.image ? [d.image] : [];
                      return (
                        <tr key={d._id}>
                          <td>{d.size}</td>
                          <td>{d.quantity}</td>
                          <td>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {imgs.map((u, i) => (
                                <img key={i} src={`${API_URL}${u}`} alt="" style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 4 }} />
                              ))}
                            </div>
                          </td>
                          <td>
                            <button onClick={() => handleEdit(d)} className="btn-edit">Sửa</button>
                            <button onClick={() => handleDelete(d._id)} className="btn-delete">Xoá</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </details>
            ))}
          </div>
        )}

        <div className="form-action">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingDetail(null);
              setSelectedSizes([]);
              setForm({ colorCode: "", colorName: "", quantity: "" });
              setNewFiles([]);
              setKeepImages([]);
            }}
            className="btn btn-add"
          >
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
              <label>Chọn size {editingDetail ? "(đang sửa 1 size)" : "(nhiều)"}</label>
              <div className="multi-size-options">
                {availableSizes.map((size) => (
                  <label
                    key={size}
                    className={`size-option ${selectedSizes.includes(size) ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      disabled={!!editingDetail} // khi edit, khoá chọn thêm size
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
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleBasicChange}
                min={0}
              />
            </div>

            {/* Kéo & thả + chọn nhiều ảnh */}
            <div className="form-group">
              <label>Ảnh sản phẩm (kéo thả hoặc chọn nhiều)</label>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed #999",
                  borderRadius: 8,
                  padding: 16,
                  textAlign: "center",
                  background: dragOver ? "#eef4ff" : "#fafafa",
                  cursor: "pointer",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={onPickFiles}
                />
                <div>📸 Kéo & thả ảnh vào đây, hoặc <u>nhấn để chọn</u></div>
                <div style={{ fontSize: 12, color: "#666" }}>Hỗ trợ JPG/PNG/WEBP, ≤ 8MB/ảnh</div>
              </div>

              {/* Preview ảnh mới */}
              {newFiles.length > 0 && (
                <>
                  <div style={{ marginTop: 10, fontWeight: 600 }}>Ảnh mới ({newFiles.length})</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                    {newFiles.map((f, i) => (
                      <div key={i} style={{ width: 100 }}>
                        <img
                          src={URL.createObjectURL(f)}
                          alt=""
                          style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 6 }}
                        />
                        <button className="btn-mini" onClick={() => removeNewFile(i)} style={{ width: "100%", marginTop: 6 }}>
                          Bỏ ảnh
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Preview ảnh đang giữ khi edit */}
              {editingDetail && keepImages.length > 0 && (
                <>
                  <div style={{ marginTop: 12, fontWeight: 600 }}>Ảnh hiện có (giữ lại)</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                    {keepImages.map((u) => (
                      <div key={u} style={{ width: 100 }}>
                        <img
                          src={`${API_URL}${u}`}
                          alt=""
                          style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 6 }}
                        />
                        <button className="btn-mini" onClick={() => removeKeepImage(u)} style={{ width: "100%", marginTop: 6 }}>
                          Bỏ khỏi giữ lại
                        </button>
                      </div>
                    ))}
                  </div>
                  <div style={{ color: "#666", fontSize: 12, marginTop: 6 }}>
                    * Ảnh bỏ khỏi “giữ lại” sẽ không gửi lên ở lần cập nhật này (không còn gắn với bản ghi).
                  </div>
                </>
              )}
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
                  setForm({ colorCode: "", colorName: "", quantity: "" });
                  setNewFiles([]);
                  setKeepImages([]);
                }}
                className="btn btn-cancel"
              >
                Huỷ
              </button>
            </div>
          </div>
        )}

        <button onClick={onClose} className="btn btn-close">Đóng</button>
      </div>
    </div>
  );
};

export default ProductDetailModal;
