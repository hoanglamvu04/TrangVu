import React from "react";

const API_URL = "http://localhost:5000";

const DescriptionModal = ({
    product,
    descriptions,
    groupedDescriptions = { form: [], material: [], design: [] }, // <-- FIX
    onClose,
    showForm,
    setShowForm,
    newDesc,
    setNewDesc,
    onChange,
    onSubmit,
    editingId,
    onEdit,
    onDelete,
  }) => {
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Mô tả sản phẩm ({product.code})</h3>

        <div className="description-grid">
          {["form", "material", "design"].map((type) => (
            <div key={type} className="description-column">
              <h4>
                {type === "form"
                  ? "Form dáng"
                  : type === "material"
                  ? "Chất liệu"
                  : "Thiết kế"}
              </h4>
              {groupedDescriptions[type].length === 0 ? (
                <p>Chưa có mô tả.</p>
              ) : (
                groupedDescriptions[type].map((desc) => (
                  <div key={desc._id} className="description-box">
                    <div>
                      <b>{desc.title}</b>: {desc.content}
                      {desc.image && (
                        <img
                          src={`${API_URL}${desc.image}`}
                          alt={desc.title}
                        />
                      )}
                    </div>
                    <div>
                      <button
                        className="btn-desc btn-edit-desc"
                        onClick={() => onEdit(desc)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn-desc btn-delete"
                        onClick={() => onDelete(desc._id)}
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>

        {!showForm && (
          <button
            className="btn-desc btn-add-desc"
            onClick={() => setShowForm(true)}
          >
            Thêm mô tả mới
          </button>
        )}

        {showForm && (
        <>
            <hr />
            <h4>{editingId ? "Chỉnh sửa mô tả" : "Thêm mô tả mới"}</h4>
            <select name="type" value={newDesc.type} onChange={onChange}>
            <option value="form">Form dáng</option>
            <option value="material">Chất liệu</option>
            <option value="design">Thiết kế</option>
            </select>
            <input name="title" placeholder="Tiêu đề" value={newDesc.title} onChange={onChange} />
            <textarea name="content" placeholder="Nội dung mô tả" value={newDesc.content} onChange={onChange} />
            <input name="image" type="file" onChange={onChange} />

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="btn-desc btn-add-desc" onClick={onSubmit}>
                {editingId ? "Cập nhật mô tả" : "Thêm mô tả"}
            </button>
            <button className="btn-desc btn-close-modal" onClick={() => {
                setShowForm(false); // ✅ Đóng form sửa/thêm
                setNewDesc({ type: "form", title: "", content: "", image: null }); // ✅ Reset form
            }}>
                Huỷ
            </button>
            </div>
        </>
        )}


        <button
          className="btn-desc btn-close-modal"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default DescriptionModal;
