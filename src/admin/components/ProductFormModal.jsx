import React from "react";

const ProductFormModal = ({
  form,
  categories,
  editingId,
  onChange,
  onSubmit,
  onClose
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</h3>
        <div className="admin-form">
          <input name="code" placeholder="Mã sản phẩm" value={form.code} onChange={onChange} />
          <input name="name" placeholder="Tên sản phẩm" value={form.name} onChange={onChange} />
          <input name="originalPrice" type="number" placeholder="Giá gốc" value={form.originalPrice} onChange={onChange} />
          <input name="discount" type="number" placeholder="Giảm giá (%)" value={form.discount} onChange={onChange} />
          <input name="finalPrice" type="number" disabled value={form.finalPrice} />
          <select name="category" value={form.category} onChange={onChange}>
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <select name="status" value={form.status} onChange={onChange}>
            <option value="Active">Đang bán</option>
            <option value="Inactive">Ngưng bán</option>
          </select>
          <input name="tags" placeholder="Tags (vd: everyday, cheap)" value={form.tags || ""} onChange={onChange} />
          <input name="image" type="file" accept="image/*" onChange={onChange} />
          <div className="form-buttons">
            <button className="btn-submit" onClick={onSubmit}>
              {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            </button>
            <button className="btn-cancel" onClick={onClose}>Huỷ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
